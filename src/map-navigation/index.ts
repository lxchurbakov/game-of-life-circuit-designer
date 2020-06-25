import _ from 'lodash'

import { EventEmitter } from '../utils/events'
import { Point } from '../advanced-events'
import HtmlBasement from '../html-basement'

export default class MapNavigation {
  public offset: Point = { x: 0, y: 0 }
  public zoom = 1

  public onRenderWithinGameCoordinates = new EventEmitter<CanvasRenderingContext2D>()

  constructor (
    private html: HtmlBasement
  ) {
    this.html.onRender.subscribe(this.render)
  }

  render = (context: CanvasRenderingContext2D) => {
    const zoomX = this.zoom, zoomY = this.zoom

    context.translate(this.html.rect.width / 2, this.html.rect.height / 2)
    context.scale(zoomX, zoomY)
    context.translate(this.offset.x, this.offset.y)

    this.onRenderWithinGameCoordinates.emitSync(context)

    context.translate(-this.offset.x, -this.offset.y)
    context.scale(1 / zoomX, 1 / zoomY)

    context.translate(-this.html.rect.width / 2, -this.html.rect.height / 2)
  }

}
