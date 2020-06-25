import HtmlBasement from '../html-basement'
import GameMode from '../game-mode'
import AdvancedEvents from '../advanced-events'

import App from './App'

export default class BottomInterface {
  app: any

  constructor (private html: HtmlBasement, private mode: GameMode, private events: AdvancedEvents) {
    this.events.onKey.subscribe(this.handleKey)

    this.html.onInitInterface.subscribe((interfaceNode: HTMLElement) => {
      const onSetMode = ($mode) => {
        mode.mode = $mode
        this.app.update({ mode: this.mode.mode }, null)
      }

      this.app = new App({ mode: this.mode.mode, onSetMode }, null)

      interfaceNode.appendChild(this.app.element)
    })
  }

  handleKey = (keyCode) => {
    if (keyCode === 68) {
      // letter D
      this.mode.mode = 'drag'
      this.app.update({ mode: this.mode.mode }, null)
    }

    if (keyCode === 87) {
      // letter W
      this.mode.mode = 'draw'
      this.app.update({ mode: this.mode.mode }, null)
    }

    if (keyCode === 69) {
      // letter E
      this.mode.mode = 'erase'
      this.app.update({ mode: this.mode.mode }, null)
    }
    // console.log(keyCode)
  }
}


