import _ from 'lodash';
import Bootstrap from "../bootstrap";
import { parse } from '../utils/parse';

export type Cell = { x: number, y: number };

const CELL_SIZE = 20;
const PADDING = 1;

export default class GameOfLife {
    public frameTime = 0;
    public lastTimeUpdated = new Date().getTime();
    public state = parse('24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!');

    constructor (private root: Bootstrap) {
        setInterval(this.calculate, 100);
        this.root.onRender.subscribe(this.render);
    }

    public calculate = () => {
        let indexedCells = []

        this.state.forEach(({ x, y }) => {
          indexedCells[x] = indexedCells[x] || [];
          indexedCells[x][y] = true;
        });

        let nextCells = [];

        this.state.forEach(({ x, y }) => {
            [
              [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
              [x - 1, y], [x, y], [x + 1, y],
              [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
            ].forEach(([x, y]) => {
              if (shouldBeAlive(indexedCells, x, y)) {
                nextCells.push({ x, y })
              }
            })
        });

        this.state = _.uniqBy(nextCells, ({ x, y }) => `${x},${y}`);

        // let time = new Date().getTime()
        // this.frameTime = (this.frameTime * 49 + (time - this.lastTimeUpdated)) / 50
        // this.lastTimeUpdated = time
    };

    public render = (context: CanvasRenderingContext2D) => {
        this.state.forEach(({ x, y }) => {
        context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - PADDING, CELL_SIZE - PADDING)
        })
    };
};

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



// // import HtmlBasement from '../html-basement'
// import GameState from '../game-state'
// import MapNavigation from '../map-navigation'
// import CellsEngine from '../cells-engine'

// export default class MainRender {
//   public CELL_SIZE = 20
//   PADDING = 1

//   constructor (private state: GameState, private map: MapNavigation, private engine: CellsEngine) {
//     this.map.onRenderWithinGameCoordinates.subscribe(this.render)
//   }

//   render = (context: CanvasRenderingContext2D) => {


//     // context.fillText(`FPS: ${1000 / this.engine.frameTime}`, 10, 10)
//   }
// }
// // 
