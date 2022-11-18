import _ from 'lodash';
import Bootstrap from "../bootstrap";
import { parse } from '../utils/parse';

export type Cell = { x: number, y: number };

// Glider Reflector: 10bo$8bobo$7bobo$6bo2bo11b2o$7bobo11b2o$2b2o4bobo$bobo6bo$bo$2o!
// Glider Gun: 24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!
// Glider Eater: 2o2b$obob$2bob$2b2bo!

export const CELL_SIZE = 20;
export const PADDING = 1;

export default class GameOfLife {
	// public frameTime = 0;
	// public lastTimeUpdated = new Date().getTime();

	// public interval = null;

	constructor(private root: Bootstrap) {
		this.root.onRender.subscribe(this.render);
	}

	// Start / Stop functionality

	private interval = null;

	public isPaused = () => {
		return this.interval === null;
	};

	public start = () => {
		this.interval = setInterval(() => {
			this.calculate();
		}, 0);
	};

	public stop = () => {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	};

	// State updating

	private state = [];

	public has = (x: number, y: number) => {
		return !!this.state.find((c) => c.x === x && c.y === y);
	};

	public put = (x: number, y: number) => {
		this.state.push({ x, y });
	};

	public remove = (x: number, y: number) => {
		this.state = this.state.filter((c) => c.x !== x || c.y !== y);
	};

	public clear = () => {
		this.state = [];
	};

	public save = () => {
		return this.state;
	};

	public load = (state) => {
		this.state = state;
	};

	private calculate = () => {
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
	};

	private render = (context: CanvasRenderingContext2D) => {
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

	return false;
};
