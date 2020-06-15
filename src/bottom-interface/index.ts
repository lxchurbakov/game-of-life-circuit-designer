import HtmlBasement from '../html-basement'
import CellsEngine from '../cells-engine'
import AdvancedEvents from '../advanced-events'

import App from './App'

export default class BottomInterface {
  constructor (private html: HtmlBasement, private cells: CellsEngine, private events: AdvancedEvents) {
    this.html.onInitInterface.subscribe((interfaceNode: HTMLElement) => {
      const onPause = () => {
        this.cells.togglePause()
        app.update({ paused: this.cells.paused }, null)
      }

      const onPrev = () => {
        this.cells.paused = false
        this.cells.back()
        this.cells.paused = true
      }

      const onNext = () => {
        this.cells.paused = false
        this.cells.forth()
        this.cells.paused = true
      }

      const app = new App({ paused: false, onPause, onPrev, onNext }, null)



      // const bottomInterfaceNode = document.createElement('div')
      //
      // bottomInterfaceNode.setAttribute(
      //   'style', 'position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); padding-bottom: 30px;'
      // )
      //
      // bottomInterfaceNode.innerHTML = `
      //   <button class="prev">
      //     Previous
      //   </button>
      //   <button class="pause">
      //     Pause
      //   </button>
      //   <button class="next">
      //     Next
      //   </button>
      // `
      //
      // bottomInterfaceNode.querySelector('.next').addEventListener('click', () => {
      //   this.cells.paused = false
      //   this.cells.forth()
      //   this.cells.paused = true
      // })
      //
      // bottomInterfaceNode.querySelector('.next').addEventListener('click', () => {
      //   this.cells.paused = false
      //   this.cells.back()
      //   this.cells.paused = true
      // })
      //
      // bottomInterfaceNode.querySelector('.pause').addEventListener('click', () => {
      //   this.cells.togglePause()
      // })
      //

      this.events.onKey.subscribe((keyCode: number) => {
        if (keyCode === 32) {
          this.cells.togglePause()
        }
      })

      interfaceNode.appendChild(app.element)
    })
  }
}


