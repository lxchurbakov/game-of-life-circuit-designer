import etch from 'etch'
import { loadStyles } from '../utils/styles'

loadStyles(`
  .palette {
    position: absolute; left: 0; top: 50%;
    transform: translateY(-50%); background: white;
    border-top-right-radius: 30px; overflow: hidden;
    border-bottom-right-radius: 30px; box-shadow: 0 0 3px 3px rgba(0, 0, 0, .1);
  }

  .palette-button {
    padding: 14px; display: flex; align-items: center; flex-direction: column; margin-bottom: 8px; cursor: pointer;
  }

  .palette-button.active {
    background: #069; color: white;
  }

  .palette-button:last-child {
    margin-bottom: 0;
  }

  .palette-button__emoji {
    font-size: 30px;
  }

  .palette-button__text {
    font-size: 12px;
  }
`)

/** @jsx etch.dom */

class Button {
  state: any
  props: any

  constructor (props: any, children: any) {
    this.state = {}
    this.props = props
    etch.initialize(this)
  }

  render () {
    const { emoji, text, active, onClick } = this.props

    return (
      <div className={`palette-button ${active ? 'active' : ''}`} onClick={onClick}>
        <span className="palette-button__emoji">{emoji}</span>
        <span className="palette-button__text">{text}</span>
      </div>
    )
  }

  setState (v) {
    this.state = { ...this.state, ...v }
    etch.update(this)
  }

  update (props, children) {
    this.props = { ...this.props, ...props }
    return etch.update(this)
  }

  async destroy () {
    await etch.destroy(this)
  }
}

export default class App {
  state: any
  props: any
  element: any

  constructor (props: any, children: any) {
    this.state = {}
    this.props = props
    etch.initialize(this)
  }

  setState (v) {
    this.state = { ...this.state, ...v }
    etch.update(this)
  }

  setMode (mode) {
    this.props.onSetMode && this.props.onSetMode(mode)
  }

  render () {
    const { mode } = this.props

    return (
      <div className="palette">
        <Button emoji="✋" text="Drag (D)" active={mode === 'drag'} onClick={() => this.setMode('drag')} />
        <Button emoji="✍️" text="Draw (W)" active={mode === 'draw'} onClick={() => this.setMode('draw')} />
        <Button emoji="✂" text="Erase (E)" active={mode === 'erase'} onClick={() => this.setMode('erase')} />
      </div>
    )
  }

  update (props, children) {
    this.props = { ...this.props, ...props }
    return etch.update(this)
  }

  async destroy () {
    await etch.destroy(this)
  }
}