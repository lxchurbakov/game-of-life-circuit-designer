import { EventEmitter } from '../utils/events'

import AdvancedEvents, { Point } from '../advanced-events'
import HtmlBasement from '../html-basement'

export default class MapNavigation {
  private offset: Point = { x: 0, y: 0 }
  private zoom = 1000

  public onRenderWithinGameCoordinates = new EventEmitter<CanvasRenderingContext2D>()

  constructor (
    private html: HtmlBasement,
    private advancedEvents: AdvancedEvents
  ) {
    this.html.onRender.subscribe(this.render)

    this.advancedEvents.onDrag.subscribe(this.handleDrag)
    this.advancedEvents.onZoom.subscribe(this.handleZoom)
  }

  render = (context: CanvasRenderingContext2D) => {
    const zoomX = this.zoom / 1000, zoomY = this.zoom / 1000

    context.translate(this.html.rect.width / 2, this.html.rect.height / 2)
    context.scale(zoomX, zoomY)
    context.translate(this.offset.x, this.offset.y)

    this.onRenderWithinGameCoordinates.emitSync(context)

    context.translate(-this.offset.x, -this.offset.y)
    context.scale(1 / zoomX, 1 / zoomY)

    context.translate(-this.html.rect.width / 2, -this.html.rect.height / 2)
  }

  handleDrag = ({ x, y }: Point) => {
    this.offset.x += x
    this.offset.y += y
  }

  handleZoom = (v: number) => {
    this.zoom += v

    this.offset.x += this.offset.x * v / 1000
    this.offset.y += this.offset.y * v / 1000
  }
}