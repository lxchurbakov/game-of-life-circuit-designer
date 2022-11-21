import Bootstrap from '../bootstrap';
import { EventEmitter } from '/src/utils/events';
import { Point } from '/src/utils/misc';

export default class Navigator {
    private translate = { x: 0, y: 0 } as Point;

    public onRender = new EventEmitter<CanvasRenderingContext2D>();

	constructor(private root: Bootstrap) {
		this.root.onRender.subscribe(this.render);
	}

    public set = ({ x, y }: Point) => {
        this.translate = { x, y };
    };

    public get = () => {
        return this.translate;
    };

    private render = (context: CanvasRenderingContext2D) => {
        context.save();
        context.translate(this.translate.x, this.translate.y);
        
        this.onRender.emitParallelSync(context);

        context.restore();
    };

    public untranslate = ({ x, y }) => {
        return {
            x: (x - this.translate.x),
            y: (y - this.translate.y),
        };
    };
};
