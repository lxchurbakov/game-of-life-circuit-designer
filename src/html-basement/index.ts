import { EventEmitter } from '../utils/events'

export type Rect = { width: number, height: number }

export default class HtmlBasement {
  rect: Rect
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  onRender = new EventEmitter<CanvasRenderingContext2D>()

  constructor (private root: HTMLElement) {
    this.rect = this.root.getBoundingClientRect();
    this.canvas = document.createElement('canvas')

    this.canvas.style.width = this.rect.width + 'px'
    this.canvas.style.height = this.rect.height + 'px'
    this.canvas.width = this.rect.width
    this.canvas.height = this.rect.height

    this.root.appendChild(this.canvas)

    this.context = this.canvas.getContext('2d')

    requestAnimationFrame(this.render)

    /* TODO UI slots come here */
  }

  render = () => {
    this.context.clearRect(0, 0, this.rect.width, this.rect.height)

    /* Emit render (other modules can put code here ) */
    this.onRender.emitSync(this.context)

    requestAnimationFrame(this.render)
  }
}
