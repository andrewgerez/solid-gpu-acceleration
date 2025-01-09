import {
  View,
} from '@lightningtv/solid'
import { createEffect, on, onMount } from 'solid-js'
import { globalBackground } from '../../state'
import styles from './styles'

function SplashScreen() {
  let splashLogoRef: any
  let heroMaskRef: any
  let active: number = 0

  function changeBackgrounds(img: string | number) {
    if (typeof img !== 'string') {
      active = 1
      heroMaskRef.alpha = 0
      return
    } else {
      heroMaskRef.alpha = 1
    }

    active = active === 1 ? 2 : 1
  }

  onMount(() => {
    splashLogoRef.animate({ alpha: 1, scale: 1 }, { duration: 1000 }).start()
    setTimeout(() => {
      splashLogoRef.animate({ alpha: 0 }, { duration: 1000 }).start()
    }, 3000)
  })

  createEffect(
    on(
      globalBackground,
      (img: string | number) => {
        changeBackgrounds(img)
      },
      { defer: true }
    )
  )

  return (
    <View width={1920} height={1080} zIndex={-5} src='./assets/background-mask.jpg' style={styles.Background}>
      <View ref={splashLogoRef} zIndex={1} src='./assets/splash-logo.png' style={styles.Logo} />
    </View>
  )
}

export default SplashScreen
