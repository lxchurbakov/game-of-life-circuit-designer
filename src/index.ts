import Bootstrap from './bootstrap'
import GameOfLife from './game-of-life';
// import MainRender from './main-render'
// import CellsEngine from './cells-engine'
// import AdvancedEvents from './advanced-events'
// import GameMode from './game-mode'
// import MapNavigation from './map-navigation'

// import BottomInterface from './bottom-interface'
// import InstrumentsPalette from './instruments-palette'

// import GameActions from './game-actions'

document.addEventListener('DOMContentLoaded', (e) => {
  const root = document.getElementById('app');

  const bootstrap = new Bootstrap(root);
  const gameOfLife = new GameOfLife(bootstrap);

  // const engine = new CellsEngine(state)
  // const events = new AdvancedEvents(html)
  // const mode = new GameMode()
  // const map = new MapNavigation(html)

  // const render = new MainRender(state, map, engine)
  // const bottomUI = new BottomInterface(html, engine, events)
  // const palette = new InstrumentsPalette(html, mode, events)

  // const actions = new GameActions(mode, events, map, state, html, render)
});
