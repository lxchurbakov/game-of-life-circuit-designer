import _ from 'lodash'
import GameState from '../game-state'

export type Cell = { x: number, y : number }

/**
 * Cells Engine updates game state (next cells generation)
 */
export default class CellsEnginge {
  paused = false
  public frameTime = 0
  lastTimeUpdated = new Date().getTime()

  constructor (private gameState: GameState) {
    setInterval(this.forth, 100)
  }

  /* Method that toggles pause (inner state) */
  togglePause = () =>
    this.paused = !this.paused

  forth = () => {

    if (this.paused) {
      return
    }

    const { livingCells } = this.gameState

    // let newCells = []
    let indexedCells = []

    livingCells.forEach(({ x, y }) => {
      indexedCells[x] = indexedCells[x] || []
      indexedCells[x][y] = true
    })

    let nextCells = []

    livingCells.forEach(({ x, y }) => {
      [
        [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
        [x - 1, y], [x, y], [x + 1, y],
        [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
      ].forEach(([x, y]) => {
        if (shouldBeAlive(indexedCells, x, y)) {
          nextCells.push({ x, y })
        }
      })
    })

    this.gameState.livingCells = _.uniqBy(nextCells, ({ x, y }) => `${x},${y}`)

    let time = new Date().getTime()
    this.frameTime = (this.frameTime * 49 + (time - this.lastTimeUpdated)) / 50
    this.lastTimeUpdated = time
  }

  back = () => {
    /* TODO */
  }
}

const shouldBeAlive = (indexedCells, x, y) => {
  const countOfNeightbors = [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
    [x + 1, y],
    [x + 1, y - 1],
    [x, y - 1],
  ].reduce((acc, [x, y]) => acc + (!!((indexedCells || [])[x] || [])[y] ? 1 : 0), 0)

  const isLive = !!((indexedCells || [])[x] || [])[y]

  if (countOfNeightbors < 2) {
    // go commit die
  } else if (countOfNeightbors === 2) {
    // stay
    if (isLive) {
      return true
    }
  } else if (countOfNeightbors === 3) {
    // go commit live
    return true
  } else if (countOfNeightbors > 3) {
    // die again
  }

  return false
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
