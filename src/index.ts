import './index.html'

import HtmlBasement from './html-basement'
import GameState from './game-state'
import MainRender from './main-render'
import CellsEngine from './cells-engine'

document.addEventListener('DOMContentLoaded', (e) => {
  const root = document.getElementById('app')

  const htmlBasement = new HtmlBasement(root)
  const gameState = new GameState()
  const render = new MainRender(htmlBasement, gameState)
  const engine = new CellsEngine(gameState)

  /* Put interface out ? */
})

