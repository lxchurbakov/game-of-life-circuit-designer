import _ from 'lodash';
import GameOfLife, { CELL_SIZE, PADDING} from '../game-of-life';
import AdvancedEvents from '../advanced-events';

const SPACE_KEY = 32;
const W_KEY = 87;
const E_KEY = 69;

export default class Editor {
	private mode = 'edit';
	private snapshot = null;
	private erase = false;

    constructor (private events: AdvancedEvents, private gameOfLife: GameOfLife) {
        this.events.onKey.subscribe((key) => {
            if (key === SPACE_KEY) {
				if (this.mode === 'edit') {
					this.mode = 'simulate';
					this.snapshot = this.gameOfLife.save();
				}

                if (this.gameOfLife.isPaused()) {
                    this.gameOfLife.start();
                } else {
                    this.gameOfLife.stop();
                }
            }

            if (key === W_KEY) {
				if (this.mode === 'simulate') {
					this.mode = 'edit';

					this.gameOfLife.stop();
					this.gameOfLife.load(this.snapshot);
				}
            }
        });

		const handlePoint = (x: number, y: number) => {
			if (this.mode !== 'edit') {
				return;
			}

			if (this.erase) {
				this.gameOfLife.remove(x, y);
			} else {
				this.gameOfLife.put(x, y);
			}
		};

		let mousepressed = false;

		this.events.onMouseDown.subscribe(({ x, y }) => {
			if (!mousepressed) {
				mousepressed = true;

				const cellX = Math.floor(x / CELL_SIZE);
				const cellY = Math.floor(y / CELL_SIZE);

				this.erase = this.gameOfLife.has(cellX, cellY);

				handlePoint(cellX, cellY);
			}
		});

		this.events.onMouseUp.subscribe(() => {
			mousepressed = false;
		});

		this.events.onMouseMove.subscribe(({ x, y }) => {
			if (mousepressed) {
				const cellX = Math.floor(x / CELL_SIZE);
				const cellY = Math.floor(y / CELL_SIZE);

				handlePoint(cellX, cellY);
			}
		});
    }
};
