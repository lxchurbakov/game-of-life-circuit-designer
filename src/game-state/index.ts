// import { EventEmitter } from '../utils/events'

export type Cell = { x: number, y : number }

export default class GameState {
  // rect: Rect
  // canvas: HTMLCanvasElement
  // context: CanvasRenderingContext2D
  //
  // onRender = new EventEmitter<CanvasRenderingContext2D>()
  livingCells: Cell[] = [
    // { x: 10, y: 10 },
    // { x: 10, y: 11 },
    // { x: 11, y: 12 },
    // { x: 11, y: 10 },
    // { x: 12, y: 10 },
    // { x: 13, y: 10 },
  ]

  // get livingCells = () => this.state.l

  // constructor () {
    // this.rect = this.root.getBoundingClientRect();
    // this.canvas = document.createElement('canvas')
    //
    // this.canvas.style.width = this.rect.width + 'px'
    // this.canvas.style.height = this.rect.height + 'px'
    // this.canvas.width = this.rect.width
    // this.canvas.height = this.rect.height
    //
    // this.root.appendChild(this.canvas)
    //
    // this.context = this.canvas.getContext('2d')
    //
    // requestAnimationFrame(this.render)

    /* TODO UI slots come here */
  // }

  // render = () => {
    // this.context.clearRect(0, 0, this.rect.width, this.rect.height)
    //
    // /* Emit render (other modules can put code here ) */
    // this.onRender.emitSync(this.context)
    //
    // requestAnimationFrame(this.render)
  // }
}
