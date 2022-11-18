import React from 'react';
import ReactToolbar from '../react-toolbar';
import AdvancedEvents from '../advanced-events';
import GameOfLife, { CELL_SIZE } from '../game-of-life';
import ApplicationModes from '../application-modes';

import { map, replay, useObservable } from '../utils/observable';

import { HandDraw } from '@styled-icons/fluentui-system-filled/HandDraw';
import { last } from 'lodash';

const SPACE_KEY = 32;
const W_KEY = 87;
const E_KEY = 69;

const DrawingModeToolbarExtension = ({ active$ }) => {
    const active = useObservable(active$);

    return (
        <HandDraw color={active ? '#2196f3' : '#333'} width={28} />
    );
};

export default class DrawingMode {
    private mode = 'edit';
    private snapshot = null;
    private erase = false;

    // public active$ = subject(true);

    constructor (private modes: ApplicationModes, private toolbar: ReactToolbar, private events: AdvancedEvents, private gameOfLife: GameOfLife) {
        this.toolbar.onContent.subscribe(() => {
            return <DrawingModeToolbarExtension active$={this.modes.mode$.pipe(map((mode) => mode === 'draw'))} />;
        });

        // Toggle between browsing mode and drawing mode on space pressed
        // this.events.onKeyDown.subscribe((key) => {
        //     if (key === SPACE_KEY) {
        //         this.active$.next(false);
        //     }
        // });

        // this.events.onKeyUp.subscribe((key) => {
        //     if (key === SPACE_KEY) {
        //         this.active$.next(true);
        //     }
        // });

        this.events.onKey.subscribe((key) => {
            // if (key === SPACE_KEY) {
            //     this.active 
            // }
            // if (key === SPACE_KEY) {
            //     if (this.mode === 'edit') {
            //         this.mode = 'simulate';
            //         this.snapshot = this.gameOfLife.save();
            //     }
        
            //     if (this.gameOfLife.isPaused()) {
            //         this.gameOfLife.start();
            //     } else {
            //         this.gameOfLife.stop();
            //     }
            // }
        
            if (key === W_KEY) {
                if (this.mode === 'simulate') {
                    this.mode = 'edit';
        
                    this.gameOfLife.stop();
                    this.gameOfLife.load(this.snapshot);
                }
            }
        });
        
        const handlePoint = (x: number, y: number) => {
            if (this.mode !== 'edit' || this.modes.get() !== 'draw') {
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





