import React from 'react';
import styled from 'styled-components';
import ReactToolbar from '../react-toolbar';
import GameOfLife from '../game-of-life';
import ApplicationModes from '../application-modes';
import AdvancedEvents from '../advanced-events';

import { Play } from '@styled-icons/fa-solid/Play';
import { StopFill } from '@styled-icons/bootstrap/StopFill';
import { Forward } from '@styled-icons/fa-solid/Forward';
import { Pause } from '@styled-icons/fa-solid/Pause';

import { useObservable, map } from '../utils/observable';

const ENTER_KEY = 13;
const ONE_KEY = 49;
const ZERO_KEY = 48;
const ESC_KEY = 27;

const ExecutionToolbar = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
    opacity: ${props => props.active ? '1' : '.4'};
`;

const ToolbarExtension = ({ active$ }) => {
    const active = useObservable(active$);
    const color = React.useMemo(() => active ? '#2196f3' : '#333', [active]);

    // #ff5722

    return (
        <ExecutionToolbar active={active}>
            <Play color={color} width={18} />
            <StopFill color={color} width={32} />
            <Forward color={color} width={24} />
        </ExecutionToolbar>
    );
};

        // this.events.onKey.subscribe((key) => {        
        //     if (key === W_KEY) {
        //         if (this.mode === 'simulate') {
        //             this.mode = 'edit';
        
        //             this.gameOfLife.stop();
        //             this.gameOfLife.load(this.snapshot);
        //         }
        //     }
        // });

export default class ExecutionMode {
    private snapshot = [];

    constructor (private toolbar: ReactToolbar, private gameOfLife: GameOfLife, private modes: ApplicationModes, private events: AdvancedEvents) {
        this.toolbar.onContent.subscribe(() => {
            return (
                <ToolbarExtension
                    active$={this.modes.mode$.pipe(map((mode) => mode === 'execute'))}
                />
            );
        });

        this.events.onKeyDown.subscribe((key) => {
            if (key === ONE_KEY) {
                if (this.modes.get() !== 'execute') {
                    this.modes.set('execute');
                    this.snapshot = this.gameOfLife.save();
                }

                if (this.gameOfLife.isPaused()) {
                    this.gameOfLife.start();
                } else {
                    this.gameOfLife.stop();
                }
            }

            if (key === ZERO_KEY) {
                this.gameOfLife.stop();
                this.gameOfLife.load(this.snapshot);
            }

            if (key === ENTER_KEY) {
                this.modes.set('execute');
                this.snapshot = this.gameOfLife.save();
            }

            if (key === ESC_KEY) {
                this.modes.set('draw');
                this.gameOfLife.stop();
                this.gameOfLife.load(this.snapshot);
            }
        });
    }
};
