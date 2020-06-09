import { EventEmitter } from '../utils/events'

import HtmlBasement from '../html-basement'

export type Point = { x: number, y: number }

/**
 * This plugin handles html events and forwards them
 * into "drag", "click" etc
 */
export default class AdvancedEvents {
  onMouseDown = new EventEmitter<Point>()
  onMouseUp = new EventEmitter<Point>()
  onMouseMove = new EventEmitter<Point>()
  onDrag = new EventEmitter<Point>()
  onClick = new EventEmitter<Point>()
  onZoom = new EventEmitter<number>()
  onKey = new EventEmitter<number>()

  lastmousepos: Point | null = null
  mousepressed = false

  constructor (private html: HtmlBasement) {
    this.html.root.addEventListener('mousedown', (e) => {
      const { clientX: x, clientY: y } = e

      this.lastmousepos = { x, y }
      this.mousepressed = true

      this.onMouseDown.emitSync({ x, y })
      // console.log('onMouseDown', { x, y })
    })

    this.html.root.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e

      if (this.mousepressed) {
        const offsetx = x - this.lastmousepos.x, offsety = y - this.lastmousepos.y

        this.onDrag.emitSync({ x: offsetx, y: offsety })
        this.lastmousepos = { x, y }
        // console.log('ondrag', { x: offsetx, y: offsety })
      }

      this.onMouseMove.emitSync({ x, y })
      // console.log('onMouseMove', { x, y })
    })

    this.html.root.addEventListener('mouseup', (e) => {
      const { clientX: x, clientY: y } = e

      if (this.mousepressed) {
        const offsetx = this.lastmousepos.x - x, offsety = this.lastmousepos.y - y

        if (Math.abs(offsetx) + Math.abs(offsety) < 20) {
          this.onClick.emitSync({ x, y })
          // console.log('onClick', { x, y })
        }

        this.mousepressed = false
      }

      this.onMouseUp.emitSync({ x, y })
      // console.log('onMouseUp', { x, y })
    })

    this.html.root.addEventListener('mousewheel', (e: any) => {
      this.onZoom.emitSync(e.deltaY)
    })

    document.addEventListener('keydown', (e: any) => {
      // console.log(e)
      this.onKey.emitSync(e.keyCode)
    })
  }
}