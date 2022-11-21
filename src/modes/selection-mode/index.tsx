import React from 'react';

import Navigator from '/src/core/navigator';
import ReactToolbar from '/src/ui/react-toolbar';
import ApplicationModes from '/src/core/application-modes';
import AdvancedEvents from '/src/core/advanced-events';
import GameOfLife, { CELL_SIZE } from '/src/core/game-of-life';

import { map, useObservable } from '/src/utils/observable';
import { SelectObject } from '@styled-icons/fluentui-system-filled/SelectObject';
import { Point } from '/src/utils/misc';
import { CreativeCommonsNoncommercialEu } from 'styled-icons/entypo';

const S_KEY = 83;

const ToolbarExptension = ({ active$ }) => {
    const active = useObservable(active$);

    return (
        <SelectObject color={active ? '#2196f3' : '#333'} width={28} />
    );
};

export default class SelectionMode {
    public selection = null as null | { from: Point, to: Point };
    public mode = 'idle' as 'idle' | 'select' | 'drag';
    private overSelection = false;
    private dragStart = null as null | Point;

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
                if (this.overSelection) {
                   this.mode = 'drag';
                   this.dragStart = this.gameOfLife.cellCoords(this.navigator.untranslate(p));
                } else {
                    this.selection = {
                        from: this.gameOfLife.cellCoords(this.navigator.untranslate(p)),
                        to: this.gameOfLife.cellCoords(this.navigator.untranslate(p)),
                    };  
                    this.mode = 'select';
                }
            }
        });

        this.events.onMouseMove.subscribe((p) => {
            if (this.modes.get() === 'select' && this.selection !== null && this.mode === 'select') {
                this.selection.to = this.gameOfLife.cellCoords(this.navigator.untranslate(p))
            }

            if (this.modes.get() === 'select' && this.selection !== null && this.mode === 'idle') {
                const cellPosition = this.gameOfLife.cellCoords(this.navigator.untranslate(p));

                this.overSelection = this.selection ? (
                    cellPosition.x >= this.selection.from.x
                    && cellPosition.x <= this.selection.to.x
                    && cellPosition.y >= this.selection.from.y
                    && cellPosition.y <= this.selection.to.y
                ) : false;
            }
        });

        // this.events.onDrag.subscribe((v) => {
        //     console.log(v)
        // });

        this.events.onMouseUp.subscribe((p) => {
            if (this.modes.get() === 'select') {
                if (this.mode === 'drag') {
                    const cellPosition = this.gameOfLife.cellCoords(this.navigator.untranslate(p));

                    if (this.dragStart && this.selection) {
                        const offsetX = cellPosition.x - this.dragStart.x;
                        const offsetY = cellPosition.y - this.dragStart.y;
    
                        this.gameOfLife.state.forEach((cell) => {
                            if (
                                cell.x >= this.selection.from.x
                                && cell.x <= this.selection.to.x
                                && cell.y >= this.selection.from.y
                                && cell.y <= this.selection.to.y
                            ) {
                                cell.x += offsetX;
                                cell.y += offsetY;
                            }
                        });
    
                        this.selection.from.x += offsetX;
                        this.selection.from.y += offsetY;
                        this.selection.to.x += offsetX;
                        this.selection.to.y += offsetY;
                    } else {
                        console.log('drag start is not defined but mode is drag? howcome')
                    }
                }

                
            }

            this.mode = 'idle';
        });

        this.navigator.onRender.subscribe((context) => {
            if (this.modes.get() === 'select' && this.selection !== null) {
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
        });

        this.modes.onModeChange.subscribe(({ before, after }) => {
            // cleanup
            console.log({ before, after })
            if (before === 'select') {
                this.selection = null;
            }
        });
    }
}
