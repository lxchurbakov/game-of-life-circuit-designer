import React from 'react';

import Navigator from '/src/core/navigator';
import ReactToolbar from '/src/ui/react-toolbar';
import AdvancedEvents from '/src/core/advanced-events';
import ApplicationModes from '/src/core/application-modes';
import GameOfLife from '/src/core/game-of-life';

import { useObservable, map } from '/src/utils/observable';

import { Drag } from '@styled-icons/fluentui-system-filled/Drag';

const SPACE_KEY = 32;

const ToolbarExtension = ({ active$ }) => {
    const active = useObservable(active$);

    return (
        <Drag color={active ? '#2196f3' : '#333'} width={28} />
    );
};

export default class BrowsingMode {
    constructor (private toolbar: ReactToolbar, private events: AdvancedEvents, private modes: ApplicationModes, private gameOfLife: GameOfLife, private navigator: Navigator) {
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

        // this.gameOfLife.onWrapRender.subscribe((predicate) => {
        //     return (context) => {
        //         context.save();
        //         context.translate(this.translate.x, this.translate.y);
        //         predicate(context);
        //         context.restore();
        //     };
        // });

        this.events.onDrag.subscribe(({ x, y }) => {
            if (this.modes.get() === 'browse') {
                const translate = this.navigator.get();

                this.navigator.set({
                    x: translate.x + x,
                    y: translate.y + y,
                });
            }
        });
    }
};
