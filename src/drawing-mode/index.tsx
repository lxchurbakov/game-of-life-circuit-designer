import React from 'react';
import ReactToolbar from '../react-toolbar';
import AdvancedEvents from '../advanced-events';
import GameOfLife, { CELL_SIZE } from '../game-of-life';
import ApplicationModes from '../application-modes';
import BrowsingMode from '../browsing-mode';

import { map, useObservable } from '../utils/observable';

import { HandDraw } from '@styled-icons/fluentui-system-filled/HandDraw';

const D_KEY = 68;

const DrawingModeToolbarExtension = ({ active$ }) => {
    const active = useObservable(active$);

    return (
        <HandDraw color={active ? '#2196f3' : '#333'} width={28} />
    );
};

export default class DrawingMode {
    private erase = false;

    constructor (private modes: ApplicationModes, private toolbar: ReactToolbar, private events: AdvancedEvents, private gameOfLife: GameOfLife, private browsingMode: BrowsingMode) {
        this.toolbar.onContent.subscribe(() => {
            return (
                <DrawingModeToolbarExtension 
                    active$={this.modes.mode$.pipe(map((mode) => mode === 'draw'))} 
                />
            );
        });

        const handlePoint = (x: number, y: number) => {
            if (this.modes.get() !== 'draw') {
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

                const cell = this.screenPosToCellPoint({ x, y });
        
                this.erase = this.gameOfLife.has(cell.x, cell.y);
                handlePoint(cell.x, cell.y);
            }
        });
        
        this.events.onMouseUp.subscribe(() => {
            mousepressed = false;
        });
        
        this.events.onMouseMove.subscribe(({ x, y }) => {
            if (mousepressed) {       
                const cell = this.screenPosToCellPoint({ x, y });

                handlePoint(cell.x, cell.y);
            }
        });

        this.events.onKeyDown.subscribe((key) => {
            if (key === D_KEY) {
                this.modes.set('draw');
            }
        });
    }

    private screenPosToCellPoint = ({ x, y }) => {
        return {
            x: Math.floor((x - this.browsingMode.translate.x) / CELL_SIZE),
            y: Math.floor((y - this.browsingMode.translate.y) / CELL_SIZE),
        };
    };
};
