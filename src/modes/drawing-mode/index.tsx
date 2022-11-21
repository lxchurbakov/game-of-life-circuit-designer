import React from 'react';

import Navigator from '/src/core/navigator';
import AdvancedEvents from '/src/core/advanced-events';
import GameOfLife, { CELL_SIZE } from '/src/core/game-of-life';
import ApplicationModes from '/src/core/application-modes';

import ReactToolbar from '/src/ui/react-toolbar';

import { map, useObservable } from '/src/utils/observable';

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

    constructor (
        private modes: ApplicationModes, 
        private toolbar: ReactToolbar, 
        private events: AdvancedEvents, 
        private gameOfLife: GameOfLife, 
        private navigator: Navigator
    ) {
        this.toolbar.onContent.subscribe(() => {
            return (
                <DrawingModeToolbarExtension 
                    active$={this.modes.mode$.pipe(map((mode) => mode === 'draw'))} 
                />
            );
        });

        this.events.onKeyDown.subscribe((key) => {
            if (key === D_KEY) {
                this.modes.set('draw');
            }
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

                const cell = this.gameOfLife.cellCoords(this.navigator.untranslate({ x, y }));
        
                this.erase = this.gameOfLife.has(cell.x, cell.y);
                handlePoint(cell.x, cell.y);
            }
        });
        
        this.events.onMouseUp.subscribe(() => {
            mousepressed = false;
        });
        
        this.events.onMouseMove.subscribe(({ x, y }) => {
            if (mousepressed) {       
                const cell = this.gameOfLife.cellCoords(this.navigator.untranslate({ x, y }));

                handlePoint(cell.x, cell.y);
            }
        });
    }    
};
