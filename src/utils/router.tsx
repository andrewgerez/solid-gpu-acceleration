import {
  type BaseRouterProps,
  createRouter,
  createBeforeLeave,
  keepDepth,
  notifyIfNotBlocked,
  saveCurrentDepth,
} from '@solidjs/router'
import type { JSX } from 'solid-js'

export function hashParser(str: string) {
  const to = str.replace(/^.*?#/, '')
  if (!to.startsWith('/')) {
    const [, path = '/'] = window.location.hash.split('#', 2)
    return `${path}#${to}`
  }
  return to
}

export type HashRouterProps = BaseRouterProps & {
  actionBase?: string
  explicitLinks?: boolean
  preload?: boolean
}

export function bindEvent(
  target: EventTarget,
  type: string,
  handler: EventListener
) {
  target.addEventListener(type, handler)
  return () => target.removeEventListener(type, handler)
}

export function HashRouter(props: HashRouterProps): JSX.Element {
  const getSource = () => window.location.hash.slice(1)
  const beforeLeave = createBeforeLeave()
  return createRouter({
    get: getSource,
    set({ value, replace, state }) {
      if (replace) {
        window.history.replaceState(keepDepth(state), '', '#' + value)
      } else {
        window.history.pushState(state, '', '#' + value)
      }
      saveCurrentDepth()
    },
    init: (notify) =>
      bindEvent(
        window,
        'hashchange',
        notifyIfNotBlocked(
          notify,
          (delta) =>
            !beforeLeave.confirm(delta && delta < 0 ? delta : getSource())
        )
      ),
    utils: {
      go: (delta) => window.history.go(delta),
      renderPath: (path) => `#${path}`,
      parsePath: hashParser,
      beforeLeave,
    },
  })(props)
}
