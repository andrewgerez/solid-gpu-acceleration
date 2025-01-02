import { createRenderer, Config, loadFonts } from '@lightningtv/solid'
import {
  WebGlCoreRenderer,
  SdfTextRenderer,
} from '@lightningjs/renderer/webgl'
import {
  CanvasCoreRenderer,
  CanvasTextRenderer,
} from '@lightningjs/renderer/canvas'

import { Inspector } from '@lightningjs/renderer/inspector'
import { HashRouter } from './utils/router'
import { Route } from '@solidjs/router'
import { lazy } from 'solid-js'
import App from './pages/app'
import Browse from './pages/browse'
import TMDB from './pages/tmdb'
import DestroyPage from './pages/destroy'
import { tmdbData, destroyData } from './api/tmdb-data'
import NotFound from './pages/not-found'
import fonts from './fonts'
import { browsePreload } from './api/browse-preload'
import { entityPreload } from './api/entity-preload'

const Entity = lazy(() => import('./pages/entity'))

const urlParams = new URLSearchParams(window.location.search)
let numImageWorkers = 3
const numWorkers = urlParams.get('numImageWorkers')
const screenSize = urlParams.get('size') ?? 'default'
const rendererMode = urlParams.get('mode') ?? 'webgl'

if (numWorkers) {
  numImageWorkers = parseInt(numWorkers)
}

const deviceLogicalPixelRatio = {
  '720': 0.666667,
  '1080': 1,
  '4k': 2,
  default: window.innerHeight / 1080,
}[screenSize]

const logFps = true
Config.debug = false
Config.animationsEnabled = true
Config.fontSettings.fontFamily = 'Roboto'
Config.fontSettings.color = '#f6f6f6'
Config.fontSettings.fontSize = 32
Config.enableShaderCaching = false

Config.rendererOptions = {
  fpsUpdateInterval: logFps ? 1000 : 0,
  inspector: Inspector,
  numImageWorkers,
  deviceLogicalPixelRatio,
  devicePhysicalPixelRatio: 1,
}

if (rendererMode === 'canvas') {
  Config.rendererOptions.fontEngines = [CanvasTextRenderer]
  Config.rendererOptions.renderEngine = CanvasCoreRenderer
} else {
  Config.rendererOptions.fontEngines = [SdfTextRenderer]
  Config.rendererOptions.renderEngine = WebGlCoreRenderer
}

const { render } = createRenderer()
loadFonts(fonts)
render(() => (
  <HashRouter root={(props) => <App {...props} />}>
    <Route path='' component={Browse} preload={browsePreload} />
    <Route path='browse/:filter' component={Browse} preload={browsePreload} />
    <Route path='tmdb' component={TMDB} preload={tmdbData} />
    <Route path='destroy' component={DestroyPage} preload={destroyData} />
    <Route path='entity/:type/:id' component={Entity} preload={entityPreload} />
    <Route path='*all' component={NotFound} />
  </HashRouter>
))
