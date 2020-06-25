// import HtmlBasement from '../html-basement'
import GameState from '../game-state'
import MapNavigation from '../map-navigation'
import CellsEngine from '../cells-engine'

export default class MainRender {
  public CELL_SIZE = 20
  PADDING = 1

  constructor (private state: GameState, private map: MapNavigation, private engine: CellsEngine) {
    this.map.onRenderWithinGameCoordinates.subscribe(this.render)
  }

  render = (context: CanvasRenderingContext2D) => {
    this.state.livingCells.forEach(({ x, y }) => {
      context.fillRect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE - this.PADDING, this.CELL_SIZE - this.PADDING)
    })

    // context.fillText(`FPS: ${1000 / this.engine.frameTime}`, 10, 10)
  }
}
