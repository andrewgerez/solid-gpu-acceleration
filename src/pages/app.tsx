import { useLocation, useNavigate } from '@solidjs/router'
import { View, Text, activeElement, renderer } from '@lightningtv/solid'
import {
  useFocusManager,
  useAnnouncer,
} from '@lightningtv/solid/primitives'
import Background from '@/components/background'
import NavDrawer from '@/components/nav-drawer/drawer'
import { FPSCounter, setupFPS } from '@lightningtv/solid-ui'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { KeyMap } from '@lightningtv/core/focusManager'
import SplashScreen from './splash-screen/splash'

declare module '@lightningtv/solid' {
  interface KeyMap {
    Announcer: (string | number)[]
    Menu: (string | number)[]
    Escape: (string | number)[]
    Backspace: (string | number)[]
  }
  interface ElementNode {
    heroContent?: boolean
    backdrop?: any
    entityInfo?: any
    href?: string
  }
}

const App = (props) => {
  useFocusManager({
    Announcer: ['a'],
    Menu: ['m'],
    Escape: ['Escape', 27],
    Backspace: ['Backspace', 8],
    Left: ['ArrowLeft', 37],
    Right: ['ArrowRight', 39],
    Up: ['ArrowUp', 38],
    Down: ['ArrowDown', 40],
    Enter: ['Enter', 13],
  } as unknown as KeyMap)
  const announcer = useAnnouncer()
  announcer.enabled = false
  const navigate = useNavigate()
  const [showSplash, setShowSplash] = createSignal(true)

  let pageContainerRef: any
  let fadeInRef: any
  let navDrawerRef: any
  let lastFocusedRef: any

  setupFPS({ renderer })

  function focusNavDrawer() {
    if (navDrawerRef.states.has('focus')) {
      return false
    }
    lastFocusedRef = activeElement()
    return navDrawerRef.setFocus()
  }

  const [showWidgets, setShowWidgets] = createSignal(true)
  const location = useLocation()
  const showOnPaths = ['/browse', '/entity']
  createEffect(() => {
    const currentPath = location.pathname
    const root = document.getElementById('root')
    let matchesPartial = showOnPaths.some((path) =>
      currentPath.startsWith(path)
    )

    if (currentPath === '/') {
      matchesPartial = true
    }

    if (root) root.remove()

    setShowWidgets(matchesPartial)
  })

  const [lastKey, setLastKey] = createSignal<string | undefined>()
  const [lastError, setLastError] = createSignal<string | undefined>()
  const keyPressHandler = (e: KeyboardEvent) => {
    setLastKey(`Last key: ${e.key}, Code: ${e.key}`)
  }
  document.addEventListener('keydown', keyPressHandler)
  const displayError = (e: any) => {
    setLastError((p) => (p ?? '') + '\n' + e.message)
  }
  document.addEventListener('onerror', displayError)
  onCleanup(() => {
    document.removeEventListener('onerror', displayError)
    document.removeEventListener('keydown', keyPressHandler)
  })

  onMount(() => {
    setTimeout(() => setShowSplash(false), 4000)
    setTimeout(() => fadeInRef.animate({ alpha: 0 }, { duration: 1000 }).start(), 4500)
  })

  return (
    <>
      {showSplash() ? (
        <SplashScreen />
      ) : (
        <>
          <View ref={fadeInRef} width={1920} height={1080} zIndex={1} src='./assets/background-mask.jpg'></View>
          <View
            ref={window.APP as any}
            onAnnouncer={() => (announcer.enabled = !announcer.enabled)}
            onLast={() => history.back()}
            onMenu={() => navigate('/')}
            style={{ width: 1920, height: 1080 }}
            onBackspace={focusNavDrawer}
            onLeft={focusNavDrawer}
            onRight={() =>
              navDrawerRef.states.has('focus') &&
              (lastFocusedRef || pageContainerRef).setFocus()
            }
          >
            <Background />
            <FPSCounter mountX={1} x={1910} y={10} alpha={showWidgets() ? 1 : 0.01} />
            <View
              mountX={1}
              width={330}
              height={28}
              x={1910}
              y={190}
              color={0x000000ff}
              hidden={!showWidgets()}
            >
              <Text fontSize={20} y={4} x={4}>
                {lastKey()}
              </Text>
            </View>

            <Text x={270} y={20} fontSize={24} contain='width' width={800}>
              {lastError()}
            </Text>
            <View ref={pageContainerRef} forwardFocus={0}>
              {props.children}
            </View>
            <NavDrawer
              ref={navDrawerRef}
              focusPage={() => lastFocusedRef.setFocus()}
              showWidgets={showWidgets()}
            />
          </View >
        </>
      )}
    </>
  )
}

export default App
