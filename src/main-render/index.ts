// import HtmlBasement from '../html-basement'
import GameState from '../game-state'
import MapNavigation from '../map-navigation'

export default class MainRender {
  CELL_SIZE = 20
  PADDING = 1

  constructor (private state: GameState, private map: MapNavigation) {
    this.map.onRenderWithinGameCoordinates.subscribe(this.render)
  }

  render = (context: CanvasRenderingContext2D) => {
    this.state.livingCells.forEach(({ x, y }) => {
      context.fillRect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE - this.PADDING, this.CELL_SIZE - this.PADDING)
    })
  }
}
