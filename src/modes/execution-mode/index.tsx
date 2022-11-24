import React from 'react';
import styled from 'styled-components';
import ReactToolbar from '/src/ui/react-toolbar';
import GameOfLife from '/src/core/game-of-life';
import ApplicationModes from '/src/core/application-modes';
import AdvancedEvents from '/src/core/advanced-events';

import { Play } from '@styled-icons/fa-solid/Play';
import { Forward } from '@styled-icons/fa-solid/Forward';
import { Pause } from '@styled-icons/fa-solid/Pause';
import { Infinite } from '@styled-icons/boxicons-regular/Infinite';

import { useObservable, map, subject } from '/src/utils/observable';

const TILDA_KEY = 192;
const ONE_KEY = 49;
const TWO_KEY = 50;
const ZERO_KEY = 48;

const ExecutionToolbar = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: ${props => props.active ? '1' : '.4'};
`;

const ToolbarExtension = ({ active$, speed$ }) => {
    const active = useObservable(active$);
    const color = React.useMemo(() => active ? '#2196f3' : '#333', [active]);
    const speed = useObservable(speed$);

    // #ff5722

    return (
        <ExecutionToolbar active={active}>
            {speed === 0 && <Pause color={color} width={18} />}
            {speed === 1 && <Play color={color} width={18} />}
            {speed === 5 && <Forward color={color} width={28} />}
            {speed === 1000 && <Infinite color={color} width={28} />}
            
        </ExecutionToolbar>
    );
};

export default class ExecutionMode {
    private snapshot = [];

    constructor (private toolbar: ReactToolbar, private gameOfLife: GameOfLife, private modes: ApplicationModes, private events: AdvancedEvents) {
        this.toolbar.onContent.subscribe(() => {
            return (
                <ToolbarExtension
                    active$={this.modes.mode$.pipe(map((mode) => mode === 'execute'))}
                    speed$={this.speed$}
                />
            );
        });

        this.events.onKeyDown.subscribe((key) => {
            if (key === TILDA_KEY) {
                this.setSpeed(0);
            }

            if (key === ONE_KEY) {
                this.setSpeed(1);
            }

            if (key === TWO_KEY) {
                this.setSpeed(5);
            }

            if (key === 51) {
                this.setSpeed(10);
            }

            if (key === 52) {
                this.setSpeed(100);
            }

            if (key === ZERO_KEY) {
                this.setSpeed(1000);
            }
        });

        this.modes.onModeChange.subscribe(({ before, after }) => {
            if (this.interval) {
                clearInterval(this.interval);
            }

            if (before !== 'execute' && after === 'execute') {
                this.snapshot = this.gameOfLife.save();
            }

            if (before === 'execute' && after !== 'execute') {
                this.gameOfLife.load(this.snapshot);
            }
        });
    }

    private speed$ = subject(0);
    private interval = null;

    private setSpeed = (speed: number) => {
        if (this.modes.get() !== 'execute') {
            this.modes.set('execute');
        }

        this.speed$.next(speed);

        if (this.interval) {
            clearInterval(this.interval);
        }

        if (speed > 0) {
            this.interval = setInterval(() => {
                this.gameOfLife.tick();
            }, 500 / speed);
        }
    };
};
