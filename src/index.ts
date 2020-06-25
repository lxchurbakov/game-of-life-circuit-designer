import './index.html'

import HtmlBasement from './html-basement'
import GameState from './game-state'
import MainRender from './main-render'
import CellsEngine from './cells-engine'
import AdvancedEvents from './advanced-events'
import GameMode from './game-mode'
import MapNavigation from './map-navigation'

import BottomInterface from './bottom-interface'
import InstrumentsPalette from './instruments-palette'

document.addEventListener('DOMContentLoaded', (e) => {
  const root = document.getElementById('app')

  const html = new HtmlBasement(root)
  const state = new GameState()

  const engine = new CellsEngine(state)
  const events = new AdvancedEvents(html)
  const mode = new GameMode()
  const map = new MapNavigation(html, events)

  const render = new MainRender(state, map, engine)
  const bottomUI = new BottomInterface(html, engine, events)
  const palette = new InstrumentsPalette(html, mode)
})

