import React from 'react';

import Navigator from '/src/core/navigator';
import ReactToolbar from '/src/ui/react-toolbar';
import ApplicationModes from '/src/core/application-modes';
import AdvancedEvents from '/src/core/advanced-events';
import GameOfLife, { CELL_SIZE } from '/src/core/game-of-life';

import { map, useObservable } from '/src/utils/observable';
import { SelectObject } from '@styled-icons/fluentui-system-filled/SelectObject';
import { Point } from '/src/utils/misc';
import { toRle } from '/src/utils/rle';

const S_KEY = 83;
// const R_KEY = 82;
// const BACKSPACE_KEY = 8;

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

        this.modes.onModeChange.subscribe(({ before, after }) => {
            if (before === 'select' && after !== 'select') {
                this.selection = null;
            }
        });

        this.setupSelection();
        
        // this.events.onMouseDown.subscribe((p) => {
        //     if (this.modes.get() === 'select') {
        //         this.handleMouseDown(p);
        //     }
        // });

        // this.events.onMouseMove.subscribe((p) => {
        //     if (this.modes.get() === 'select') {
        //         this.handleMouseMove(p);
        //     }
        // });

        // this.events.onMouseUp.subscribe((p) => {
        //     if (this.modes.get() === 'select') {
        //         this.handleMouseUp(p);
        //     }
        // });

        // this.navigator.onRender.subscribe((context) => {
        //     this.render(context);
        // });

        // this.modes.onModeChange.subscribe(({ before }) => {
        //     if (before === 'select') {
        //         this.cleanup();
        //     }
        // });

        // this.events.onKey.subscribe((key) => {
        //     if (this.modes.get() === 'select') {
        //         if (key === BACKSPACE_KEY) {
        //             this.deleteSelection();
        //         }

        //         if (key === R_KEY) {
        //             this.rotateSelection();
        //         }
        //     }
        // })
    }

    // Seletion logic

    private selection = null as null | { from: Point, to: Point };
    private selectionMode = 'idle' as 'idle' | 'select' | 'move';
    private isMouseOverSelection = false;
    private cellStartDrag = null as null | Point;
    // private dragStart = null as null | Point;
    // private mouseOverSelection = false;
    // private mode = 'idle' as 'idle' | 'select' | 'drag';

    private setupSelection = () => {
        this.events.onMouseDown.subscribe((p) => {
            if (this.modes.get() === 'select') {
                const cell = this.gameOfLife.cellCoords(this.navigator.untranslate(p));

                if (this.selectionMode === 'idle') {
                    if (this.isMouseOverSelection) {
                        this.selectionMode = 'move';
                        this.cellStartDrag = cell;
                    } else {
                        this.selection = { from: cell, to: cell };
                        this.selectionMode = 'select';
                    }                        
                }
            }
        });

        this.events.onMouseMove.subscribe((p) => {
            if (this.modes.get() === 'select') {
                const cell = this.gameOfLife.cellCoords(this.navigator.untranslate(p));

                if (this.selectionMode === 'idle') {
                    this.isMouseOverSelection = (this.selection !== null) && (this.cellInSelection(cell));
                }

                if (this.selectionMode === 'select') {
                    this.selection.to = cell;
                }

                if (this.selectionMode === 'move') {
                    const dx = cell.x - this.cellStartDrag.x;
                    const dy = cell.y - this.cellStartDrag.y;

                    this.moveSelection(dx, dy);
                    this.cellStartDrag = cell;
                }
            }
        });

        this.events.onMouseUp.subscribe(() => {
            this.selectionMode = 'idle';
        });

        this.navigator.onRender.subscribe((context) => {
            if (this.selection) {
                context.beginPath();
                context.rect(
                    this.selection.from.x * CELL_SIZE,
                    this.selection.from.y * CELL_SIZE,
                    (this.selection.to.x - this.selection.from.x) * CELL_SIZE,
                    (this.selection.to.y - this.selection.from.y) * CELL_SIZE
                );
    
                context.setLineDash([15, 5]);
                context.lineWidth = 3;
                context.stroke();
                context.setLineDash([]);
            }
        });

        this.events.onKeyDown.subscribe((key) => {
            if (this.modes.get() !== 'select' || this.selection === null) {
                return;
            }

            // Move with arrows
            if (key === 37) { // left
                this.moveSelection(-1, 0);
            }

            if (key === 39) { // right
                this.moveSelection(1, 0);
            }

            if (key === 40) { // down
                this.moveSelection(0, 1);
            }

            if (key === 38) { // up
                this.moveSelection(0, -1);
            }

            // Flip

            if (key === 65) { // a
                this.flipSelection(false, true);
            }

            if (key === 87) { // a
                this.flipSelection(true, false);
            }

            if (key === 8) {
                this.removeCells();
            }

            if (key === 13) {
                console.log(this.copySelection());
            }
        });

    };

    // Helpers

    private cellInSelection = (cellPosition: Point) => {
        return this.selection !== null && (
            cellPosition.x >= this.selection.from.x
            && cellPosition.x <= this.selection.to.x
            && cellPosition.y >= this.selection.from.y
            && cellPosition.y <= this.selection.to.y
        );
    };

    private moveSelection = (dx: number, dy: number) => {
        this.gameOfLife.state.forEach((cell) => {
            if (this.cellInSelection(cell)) {
                cell.x += dx;
                cell.y += dy;
            }
        });

        this.selection.from.x += dx;
        this.selection.from.y += dy;
        this.selection.to.x += dx;
        this.selection.to.y += dy;
    };

    private flipSelection = (vertical: boolean, horizontal: boolean) => {
        const dx = (this.selection.to.x + this.selection.from.x) / 2;
        const dy = (this.selection.to.y + this.selection.from.y) / 2;

        this.gameOfLife.state.forEach((cell) => {
            if (this.cellInSelection(cell)) {
                if (horizontal) {
                    cell.x = -(cell.x - dx) + dx;
                }

                if (vertical) {
                    cell.y = -(cell.y - dy) + dy;
                }
            }
        });
    };

    private removeCells = () => {
        this.gameOfLife.state.forEach((cell) => {
            if (this.cellInSelection(cell)) {
                this.gameOfLife.remove(cell.x, cell.y);
            }
        });
    };

    private copySelection = () => {
        return toRle(this.gameOfLife.state.filter((cell) => this.cellInSelection(cell)));
    };
}
