import _ from 'lodash';
import GameOfLife, { CELL_SIZE } from '/src/core/game-of-life';
import Navigator from '/src/core/navigator';

export default class Trails {
    constructor (private gameOfLife: GameOfLife, private navigator: Navigator) {
        this.gameOfLife.onAfterTick.subscribe(this.updateTrail); 
        this.navigator.onRender.subscribe(this.render, -10);
    }

    private trail = [];

    private updateTrail = () => {
        this.trail.forEach((cell) => {
            cell.age++;

            if (cell.age > 100) {
                this.trail = this.trail.filter((c) => c !== cell);
            }
        });

        this.trail = _.uniqBy(this.trail.concat(this.gameOfLife.state.map((c) => ({ ...c, age: 0 }))).reverse(), (c) => `${c.x},${c.y}`);
        // console.log(this.trail.length);
        // console.log(this.gameOfLife.state.length);
        // this.state = _.uniqBy(nextCells, ({ x, y }) => `${x},${y}`);
    };

    private render = (context) => {
        

        this.trail.forEach(({ x, y, age }) => {
            const coef = Math.floor(255 - age / 10).toString(16).padStart(2, '0');
            context.fillStyle = '#' + coef + coef + coef;
            context.beginPath();
            context.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            context.fill();
        });

        context.fillStyle = '#333';
    };
}