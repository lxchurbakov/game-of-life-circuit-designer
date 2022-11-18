import { EventEmitter } from '../utils/events';
import Bootstrap from '../bootstrap';

export type Point = { x: number, y: number }

/**
 * This plugin handles html events and forwards them
 * into "drag", "click" etc
 */
export default class AdvancedEvents {
  public onMouseDown = new EventEmitter<Point>()
  public onMouseUp = new EventEmitter<Point>()
  public onMouseMove = new EventEmitter<Point>()
  public onDrag = new EventEmitter<Point>()
  public onClick = new EventEmitter<Point>()
  public onZoom = new EventEmitter<number>()
  public onKey = new EventEmitter<number>()

  private lastmousepos: Point | null = null;
  private mousepressed = false;

  constructor (private root: Bootstrap) {
    this.root.layout.addEventListener('mousedown', (e) => {
      const { clientX: x, clientY: y } = e;

      this.lastmousepos = { x, y };
      this.mousepressed = true;

      this.onMouseDown.emitSync({ x, y });
    });

    this.root.layout.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;

      if (this.mousepressed) {
        const offsetx = x - this.lastmousepos.x, offsety = y - this.lastmousepos.y;

        this.onDrag.emitSync({ x: offsetx, y: offsety });
        this.lastmousepos = { x, y };
      }

      this.onMouseMove.emitSync({ x, y });
    });

    this.root.layout.addEventListener('mouseup', (e) => {
      const { clientX: x, clientY: y } = e;

      if (this.mousepressed) {
        const offsetx = this.lastmousepos.x - x, offsety = this.lastmousepos.y - y;

        if (Math.abs(offsetx) + Math.abs(offsety) < 20) {
          this.onClick.emitSync({ x, y });
        }

        this.mousepressed = false;
      };

      this.onMouseUp.emitSync({ x, y });
    });

    this.root.layout.addEventListener('mousewheel', (e: any) => {
      this.onZoom.emitSync(e.deltaY);
    });

    document.addEventListener('keydown', (e: any) => {
      this.onKey.emitSync(e.keyCode);
    });
  }
};
