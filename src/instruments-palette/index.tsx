import HtmlBasement from '../html-basement'
import GameMode from '../game-mode'
// import AdvancedEvents from '../advanced-events'

import App from './App'

export default class BottomInterface {
  constructor (private html: HtmlBasement, private mode: GameMode) {
    this.html.onInitInterface.subscribe((interfaceNode: HTMLElement) => {
      const onSetMode = ($mode) => {
        mode.mode = $mode
        app.update({ mode: mode.mode }, null)
      }

      const app = new App({ mode: mode.mode, onSetMode }, null)

      interfaceNode.appendChild(app.element)
    })
  }
}


