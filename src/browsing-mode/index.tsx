import React from 'react';
import ReactToolbar from '../react-toolbar';
import AdvancedEvents from '../advanced-events';
import ApplicationModes from '../application-modes';
import GameOfLife from '../game-of-life';

import { useObservable, map } from '../utils/observable';

import { Drag } from '@styled-icons/fluentui-system-filled/Drag';

const SPACE_KEY = 32;

const ToolbarExtension = ({ active$ }) => {
    const active = useObservable(active$);

    return (
        <Drag color={active ? '#2196f3' : '#333'} width={28} />
    );
};

export default class BrowsingMode {
    public translate = { x:0, y: 0 };

    constructor (private toolbar: ReactToolbar, private events: AdvancedEvents, private modes: ApplicationModes, private gameOfLife: GameOfLife) {
        this.toolbar.onContent.subscribe(() => {
            return (
                <ToolbarExtension
                    active$={this.modes.mode$.pipe(map((mode) => mode === 'browse'))}
                />
            );
        });

        let previousMode = null;

        this.events.onKeyDown.subscribe((key) => {
            if (key === SPACE_KEY && this.modes.get() !== 'browse') {
                previousMode = this.modes.get();
                this.modes.set('browse');
            }
        });

        this.events.onKeyUp.subscribe((key) => {
            if (key === SPACE_KEY) {
                this.modes.set(previousMode);
            }
        });

        this.gameOfLife.onWrapRender.subscribe((predicate) => {
            return (context) => {
                context.save();
                context.translate(this.translate.x, this.translate.y);
                predicate(context);
                context.restore();
            };
        });

        // let mousepressed = false;
        // this.events.onMouseDown.subscribe(({ x, y }) => {
        //     if (this.modes.get() === 'browse') {
        //         mousepressed = true;
        //     }
        // });

        this.events.onDrag.subscribe(({ x, y }) => {
            if (this.modes.get() === 'browse') {
                this.translate.x += x;
                this.translate.y += y;
            }
        });

        // this.events.onMouseUp.subscribe(({ x, y }) => {
        //     mousepressed = false;
        // });
    }
};
