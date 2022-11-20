import React from 'react';

import ReactToolbar from '../react-toolbar';
import ApplicationModes from '../application-modes';
import AdvancedEvents from '../advanced-events';
import GameOfLife from '../game-of-life';

import { map, useObservable } from '../utils/observable';
import { SelectObject } from '@styled-icons/fluentui-system-filled/SelectObject';

const S_KEY = 83;

const ToolbarExptension = ({ active$ }) => {
    const active = useObservable(active$);

    return (
        <SelectObject color={active ? '#2196f3' : '#333'} width={28} />
    );
};

export default class SelectionMode {
    constructor (private toolbar: ReactToolbar, private modes: ApplicationModes, private events: AdvancedEvents, private gameOfLife: GameOfLife) {
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
        
        let start = null;
        let end = null;

        this.events.onMouseDown.subscribe(({ x, y }) => {
            if (this.modes.get() === 'select') {
                start = { x, y };
                end = { x, y };
            }
        });

        this.events.onMouseMove.subscribe(({ x, y }) => {
            if (this.modes.get() === 'select') {
                end = { x, y };
            }
        });

        this.gameOfLife.onWrapRender.subscribe((render) => {
            return (context) => {
                render(context);

                if (start && end) {
                    context.beginPath();
                    context.moveTo(start.x, start.y);
                    context.lineTo(end.x, end.y);
                    context.stroke();
                }
            };
        });
    }
}
