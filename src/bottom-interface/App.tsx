import etch from 'etch'

/** @jsx etch.dom */

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

  render () {
    return (
      <div style="
        position: absolute; bottom: 0; left: 50%;
        transform: translateX(-50%); background: white;
        border-top-right-radius: 30px; padding: 18px;
        border-top-left-radius: 30px; box-shadow: 0 0 3px 3px rgba(0, 0, 0, .1)
      ">
        <div style="
          display: flex; align-items: center;
        ">
          <span style="font-size: 44px;">👾</span>
          <div style="margin-left: 12px; margin-right: 28px;">
            <div style="font-weight: bold">Conway's Game of Life</div>
            <div style="font-size: 11px">by mcfinley</div>
          </div>

          <button style="margin-right: 12px; padding: 8px 16px; background: #069; border-radius: 3px; color: white; font-weight: bold; border: none;" onClick={this.props.onPrev}>Step Back</button>
          <button style="margin-right: 12px; padding: 8px 16px; background: #069; border-radius: 3px; color: white; font-weight: bold; border: none;" onClick={this.props.onPause}>
            {!!this.props.paused ? 'Play' : 'Pause'}
          </button>
          <button style="padding: 8px 16px; background: #069; border-radius: 3px; color: white; font-weight: bold; border: none;" onClick={this.props.onNext}>Step Forth</button>
        </div>
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