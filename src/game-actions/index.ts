import GameMode from '../game-mode'
import AdvancedEvents, { Point } from '../advanced-events'
import MapNavigation from '../map-navigation'
import GameState from '../game-state'
import HtmlBasement from '../html-basement'
import MainRender from '../main-render'

export default class GameActions {
  constructor (
    private mode: GameMode, private advancedEvents: AdvancedEvents, private map: MapNavigation,
    private state: GameState, private html: HtmlBasement, private render: MainRender,
  ) {
    this.advancedEvents.onDrag.subscribe(this.handleDrag)
    this.advancedEvents.onZoom.subscribe(this.handleZoom)
    this.advancedEvents.onMouseDown.subscribe(this.handleMouseDown)
    this.advancedEvents.onMouseMove.subscribe(this.handleMouseMove)
    this.advancedEvents.onMouseUp.subscribe(this.handleMouseUp)
  }

  handleDrag = ({ x, y }: Point) => {
    if (this.mode.mode === 'drag') {
      this.map.offset.x += x / this.map.zoom
      this.map.offset.y += y / this.map.zoom
    }
  }

  handleZoom = (v: number) => {
    // if (this.mode.mode === 'drag') {
      this.map.zoom += v / 1000
      this.map.zoom = Math.max(0.1, Math.min(10, this.map.zoom))
    // }
  }

  public drawing = false
  public erasing = false
  handleMouseDown = ({ x, y }) => {
    if (this.mode.mode === 'draw') {
      this.drawing = true
    }
    if (this.mode.mode === 'erase') {
      this.erasing = true
    }
  }

  handleMouseMove = ({ x, y }) => {
    if (this.drawing) {
      const { width, height } = this.html.rect
      let inGameX = Math.round((((x - width / 2 ) / this.map.zoom - this.map.offset.x) / this.render.CELL_SIZE))
      let inGameY = Math.round((((y - height / 2 ) / this.map.zoom - this.map.offset.y) / this.render.CELL_SIZE))

      this.state.livingCells.push({ x: inGameX, y: inGameY })
    }
    if (this.erasing) {
      const { width, height } = this.html.rect
      let inGameX = Math.round((((x - width / 2 ) / this.map.zoom - this.map.offset.x) / this.render.CELL_SIZE))
      let inGameY = Math.round((((y - height / 2 ) / this.map.zoom - this.map.offset.y) / this.render.CELL_SIZE))

      this.state.livingCells = this.state.livingCells.filter(({ x, y }) => Math.abs(inGameX - x) > 1 || Math.abs(inGameY - y) > 1)
    }
  }

  handleMouseUp = ({ x, y }) => {
    this.drawing = false
    this.erasing = false
  }
}