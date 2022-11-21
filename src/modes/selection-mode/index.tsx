import React from 'react';

import Navigator from '/src/core/navigator';
import ReactToolbar from '/src/ui/react-toolbar';
import ApplicationModes from '/src/core/application-modes';
import AdvancedEvents from '/src/core/advanced-events';
import GameOfLife, { CELL_SIZE } from '/src/core/game-of-life';

import { map, useObservable } from '/src/utils/observable';
import { SelectObject } from '@styled-icons/fluentui-system-filled/SelectObject';
import { Point } from '/src/utils/misc';

const S_KEY = 83;
const R_KEY = 82;
const BACKSPACE_KEY = 8;

const ToolbarExptension = ({ active$ }) => {
    const active = useObservable(active$);

    return (
        <SelectObject color={active ? '#2196f3' : '#333'} width={28} />
    );
};

export default class SelectionMode {
    constructor (private toolbar: ReactToolbar, private modes: ApplicationModes, private events: AdvancedEvents, private gameOfLife: GameOfLife, private navigator: Navigator) {
        this.toolbar.onContent.subscribe(() => {
            return (
                <ToolbarExptension active$={this.modes.mode$.pipe(map((mode) => mode === 'select'))} />
            );
        });

        this.events.onKeyDown.subscribe((key) => {
            if (key === S_KEY) {
                this.modes.set('select');
            }
        });
        
        this.events.onMouseDown.subscribe((p) => {
            if (this.modes.get() === 'select') {
                this.handleMouseDown(p);
            }
        });

        this.events.onMouseMove.subscribe((p) => {
            if (this.modes.get() === 'select') {
                this.handleMouseMove(p);
            }
        });

        this.events.onMouseUp.subscribe((p) => {
            if (this.modes.get() === 'select') {
                this.handleMouseUp(p);
            }
        });

        this.navigator.onRender.subscribe((context) => {
            this.render(context);
        });

        this.modes.onModeChange.subscribe(({ before }) => {
            if (before === 'select') {
                this.cleanup();
            }
        });

        this.events.onKey.subscribe((key) => {
            if (this.modes.get() === 'select') {
                if (key === BACKSPACE_KEY) {
                    this.deleteSelection();
                }

                if (key === R_KEY) {
                    this.rotateSelection();
                }
            }
        })
    }

    // Seletion logic

    public selection = null as null | { from: Point, to: Point };
    private dragStart = null as null | Point;
    private mouseOverSelection = false;
    private mode = 'idle' as 'idle' | 'select' | 'drag';

    private cellInSelection = (cellPosition: Point) => {
        return this.selection !== null && (
            cellPosition.x >= this.selection.from.x
            && cellPosition.x <= this.selection.to.x
            && cellPosition.y >= this.selection.from.y
            && cellPosition.y <= this.selection.to.y
        );
    };

    private handleMouseDown = (p: Point) => {
        if (this.mouseOverSelection) {
            this.mode = 'drag';
            this.dragStart = this.gameOfLife.cellCoords(this.navigator.untranslate(p));
        } else {
            this.selection = {
                from: this.gameOfLife.cellCoords(this.navigator.untranslate(p)),
                to: this.gameOfLife.cellCoords(this.navigator.untranslate(p)),
            }; 

            this.mode = 'select';
        }
    };

    private handleMouseMove = (p: Point) => {
        if (this.mode === 'select') {
            this.selection.to = this.gameOfLife.cellCoords(this.navigator.untranslate(p));
        }

        if (this.mode === 'idle') {
            this.mouseOverSelection = this.selection !== null 
                && this.cellInSelection(this.gameOfLife.cellCoords(this.navigator.untranslate(p)));
        }

        if (this.mode === 'drag') {
            const dragEnd = this.gameOfLife.cellCoords(this.navigator.untranslate(p));

            const dx = dragEnd.x - this.dragStart.x;
            const dy = dragEnd.y - this.dragStart.y;

            this.gameOfLife.state.forEach((cell) => {
                if (this.cellInSelection(cell)) {
                    cell.x += dx;
                    cell.y += dy;
                }
            });

            this.dragStart = dragEnd;

            this.selection.from.x += dx;
            this.selection.from.y += dy;
            this.selection.to.x += dx;
            this.selection.to.y += dy;
        }
    };

    private handleMouseUp = (p: Point) => {
        this.mode = 'idle';
    };

    private render = (context: CanvasRenderingContext2D) => {
        if (this.selection) {
            context.beginPath();
            context.rect(
                this.selection.from.x * CELL_SIZE,
                this.selection.from.y * CELL_SIZE,
                (this.selection.to.x - this.selection.from.x) * CELL_SIZE,
                (this.selection.to.y - this.selection.from.y) * CELL_SIZE
            );

            context.setLineDash([15, 5]);
            context.lineWidth = 5;
            context.stroke();
            context.setLineDash([]);
        }
    };

    private cleanup = () => {
        this.selection = null;
        this.mode = 'idle';
    };

    private deleteSelection = () => {
        if (this.selection !== null) {
            this.gameOfLife.state.forEach((cell) => {
                if (this.cellInSelection(cell)) {
                    this.gameOfLife.remove(cell.x, cell.y);
                }
            });
        }
    };

    private rotateSelection = () => {
        if (this.selection !== null) {
            const dx = (this.selection.to.x + this.selection.from.x) / 2;
            const dy = (this.selection.to.y + this.selection.from.y) / 2;

            const cells = this.gameOfLife.state.filter((cell) => this.cellInSelection(cell));

            const rotateCell = (cell: Point) => {
                const x = cell.x - dx;
                const y = cell.y - dy;

                const newY = dy - x;
                const newX = dx - y;

                return { x: newX, y: newY };
            };

            cells.forEach((cell) => {
                const newCell = rotateCell(cell);

                this.gameOfLife.remove(cell.x, cell.y);
                this.gameOfLife.put(newCell.x, newCell.y);
            });

            const newFrom = rotateCell(this.selection.from);
            const newTo = rotateCell(this.selection.to);
            
            this.selection.from = newFrom;
            this.selection.to = newTo;
        }
    }
}