import HtmlBasement from '../html-basement'
import CellsEngine from '../cells-engine'
import AdvancedEvents from '../advanced-events'

export default class BottomInterface {
  constructor (private html: HtmlBasement, private cells: CellsEngine, private events: AdvancedEvents) {
    this.html.onInitInterface.subscribe((interfaceNode: HTMLElement) => {
      const bottomInterfaceNode = document.createElement('div')

      bottomInterfaceNode.setAttribute(
        'style', 'position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); padding-bottom: 30px;'
      )

      bottomInterfaceNode.innerHTML = `
        <button class="prev">
          Previous
        </button>
        <button class="pause">
          Pause
        </button>
        <button class="next">
          Next
        </button>
      `

      bottomInterfaceNode.querySelector('.next').addEventListener('click', () => {
        this.cells.paused = false
        this.cells.forth()
        this.cells.paused = true
      })

      bottomInterfaceNode.querySelector('.next').addEventListener('click', () => {
        this.cells.paused = false
        this.cells.back()
        this.cells.paused = true
      })

      bottomInterfaceNode.querySelector('.pause').addEventListener('click', () => {
        this.cells.togglePause()
      })

      this.events.onKey.subscribe((keyCode: number) => {
        if (keyCode === 32) {
          this.cells.togglePause()
        }
      })

      interfaceNode.appendChild(bottomInterfaceNode)
    })
  }
}