import { EventEmitter } from '../utils/events'

export type Rect = { width: number, height: number }

/**
 * HTML BASEMENT plugin initializes html node, creats canvas and sets up rendering cycle
 */
export default class HtmlBasement {
  public rect: Rect
  public canvas: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  public interface: HTMLElement

  public onRender = new EventEmitter<CanvasRenderingContext2D>()
  public onInitInterface = new EventEmitter<HTMLElement>()

  constructor (public root: HTMLElement) {
    /**
     * Canvas section
     */
    this.rect = this.root.getBoundingClientRect();
    this.canvas = document.createElement('canvas')

    this.canvas.style.width = this.rect.width + 'px'
    this.canvas.style.height = this.rect.height + 'px'
    this.canvas.width = this.rect.width
    this.canvas.height = this.rect.height

    this.root.appendChild(this.canvas)

    this.context = this.canvas.getContext('2d')

    requestAnimationFrame(this.render)

    /**
     * Interface section (creates a node, adds hooks)
     */
    this.interface = document.createElement('div')

    this.interface.style.position = 'absolute'
    this.interface.style.top = '0px'
    this.interface.style.left = '0px'
    this.interface.style.width = '100vw'
    this.interface.style.height = '100vh'

    this.root.appendChild(this.interface)

    setTimeout(() => {
      this.onInitInterface.emitSync(this.interface)
    }, 0)
  }

  render = () => {
    this.context.clearRect(0, 0, this.rect.width, this.rect.height)

    /* Emit render (other modules can put code here ) */
    this.onRender.emitSync(this.context)

    requestAnimationFrame(this.render)
  }
}
