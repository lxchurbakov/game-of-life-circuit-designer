// import { EventEmitter } from '../utils/events'
import GameState from '../game-state'

export type Cell = { x: number, y : number }

export default class CellsEnginge {
  paused = false

  constructor (private gameState: GameState) {
    setInterval(this.proceed, 100)
  }

  togglePause = () => this.paused = !this.paused

  proceed = () => {
    const items = this.gameState.livingCells

    if (items.length === 0 || this.paused) {
      return
    }

    const xystoprocess = items.reduce((acc, item) => acc.concat([
      { x: item.x, y: item.y },

      { x: item.x - 1, y: item.y },
      { x: item.x - 1, y: item.y - 1 },
      { x: item.x, y: item.y - 1 },

      { x: item.x + 1, y: item.y },
      { x: item.x + 1, y: item.y + 1 },
      { x: item.x, y: item.y + 1 },

      { x: item.x - 1, y: item.y + 1 },
      { x: item.x + 1, y: item.y - 1 },
    ]), []).sort((a, b) => (a.x === b.x ? (a.y > b.y ? 1 : -1) : (a.x > b.x ? 1 : -1)))

    let nextItems = []
    let prev = { x: null, y: null }

    xystoprocess.forEach(({ x, y }) => {
      if (prev.x !== x || prev.y !== y) {
        const countOfNeightbors = items.filter((item) => isNeighbor(item, x, y)).length
        const isLive = !!items.filter((item) => item.x === x && item.y === y).pop()

        if (countOfNeightbors < 2) {
          // go commit die
        } else if (countOfNeightbors === 2) {
          // stay
          if (isLive) {
            nextItems.push({ x, y })
          }
        } else if (countOfNeightbors === 3) {
          // go commit live
          nextItems.push({ x, y })
        } else if (countOfNeightbors > 3) {
          // die again
        }

        prev = {x, y}
      }
    })

    /* /TODO unrefactored code end*/

    this.gameState.livingCells = nextItems
  }
}

/**
 * TODO unrefactored helper
 */
const isNeighbor = (item, x, y) => {
  if (item.x === x && item.y === y) {
    return false
  }

  return Math.abs(item.x - x) <= 1 && Math.abs(item.y - y) <= 1
}