import { EventEmitter } from '/src/utils/events';
import { Rect } from '/src/utils/misc';

export default class Bootstrap {
	public rect: Rect;
	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;

	public layout: HTMLElement;

	public onRender = new EventEmitter<CanvasRenderingContext2D>();
	public onLayout = new EventEmitter<HTMLElement>();

	constructor(private root: HTMLElement) {
		/**
		 *  Initializing canvas node and context
		 */
		this.rect = this.root.getBoundingClientRect();
		this.canvas = document.createElement('canvas');

		this.canvas.style.width = this.rect.width + 'px';
		this.canvas.style.height = this.rect.height + 'px';
		this.canvas.width = this.rect.width;
		this.canvas.height = this.rect.height;

		this.root.appendChild(this.canvas);

		this.context = this.canvas.getContext('2d');

		/**
		 * Now we proceed to interface node - the one that
		 * will accept all the interactions
		 */
		this.layout = document.createElement('div');

		this.layout.style.position = 'absolute';
		this.layout.style.top = '0px';
		this.layout.style.left = '0px';
		this.layout.style.width = '100%';
		this.layout.style.height = '100%';

		this.root.appendChild(this.layout);

		setTimeout(() => {
			this.onLayout.emitSync(this.layout);
			this.render();
		}, 0);
	}

	/**
	 * Render function
	 */
	public render = () => {
		this.context.clearRect(0, 0, this.rect.width, this.rect.height);

		this.onRender.emitSync(this.context);

		requestAnimationFrame(this.render);
	};
};
