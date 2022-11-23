import _ from 'lodash';

import Bootstrap from '../bootstrap';
import Navigator from '../navigator';

import { shouldBeAlive } from './utils';
import { Point } from '/src/utils/misc';

export type Cell = Point;

export const CELL_SIZE = 14;
export const PADDING = 1;

export default class GameOfLife {
	constructor(private root: Bootstrap, private navigator: Navigator) {
        // Hook render
		this.navigator.onRender.subscribe(this.render);

        // Calculate all the time
		// setInterval(this.calculate, 0);
	}

	// Start / Stop functionality

	// private paused = true;

	// public isPaused = () => this.paused;
	// public start = () => { this.paused = false; };
	// public stop = () => { this.paused = true; };

	// State updating

	public state = [];

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

    // Save load (for snapshots)

	public save = () => this.state
	public load = (state) => { this.state = state;};

    // Actual game of life code

	public tick = () => {
		let indexedCells = [];

		this.state.forEach(({ x, y }) => {
			indexedCells[x] = indexedCells[x] || [];
			indexedCells[x][y] = true;
		});

		let nextCells = [];

		this.state.forEach(({ x, y }) => {
			;[[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]].forEach(([dx, dy]) => {
				if (shouldBeAlive(indexedCells, x + dx, y + dy)) {
					nextCells.push({ x: x + dx, y: y + dy });
				}
			});
		});

		this.state = _.uniqBy(nextCells, ({ x, y }) => `${x},${y}`);
	};

	// Render actual game state

	private render = (context: CanvasRenderingContext2D) => {
		this.state.forEach(({ x, y }) => {
            context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - PADDING, CELL_SIZE - PADDING);
        });
	};

	// Helpers

	public cellCoords = (p: Point) => {
		return {
			x: Math.floor(p.x / CELL_SIZE),
			y: Math.floor(p.y / CELL_SIZE),
		};
	};
};

