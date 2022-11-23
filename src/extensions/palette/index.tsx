import React from 'react';
import styled from 'styled-components';

import ReactSidebar from '/src/ui/react-sidebar';
import GameOfLife, { CELL_SIZE } from '/src/core/game-of-life';
import Navigator from '/src/core/navigator';

import { GLIDER_GUN, GLIDER_REFLECTOR, GLIDER_EATER, GLIDER_GUN_P60,fromRle } from '/src/utils/rle';
import { Point } from '/src/utils/misc';

import { Gun } from '@styled-icons/fa-solid/Gun';

const NOPE_GATE = fromRle(`28bo32b$28bobo30b$11b2o18b2o28b$9bo3bo17b2o4b2o22b$3b2o3bo5bo16b2o4b2o22b$3b2o2b2obo3bo13bobo30b$8bo5bo13bo32b$9bo3bo47b$11b2o48b$61b$61b$61b$61b$61b$61b$61b$10bobo48b$9bo2bo3b2o43b$2o6b2o5b3ob2o2b2o36b$2o4b2o3bo3bo3bo3bobo35b$8b2o5bobo8bo34b$9bo2bo2b2o4bobo2bo34b$10bobo13bo34b$23bobo7b2o26b$23b2o8bobo25b$35bo25b$35b2o24b$61b$61b$61b$61b$61b$61b$61b$61b$61b$61b$61b$61b$61b$57b2o2b$57bobob$59bob$59b2o$`);

const PALETTE_ELEMENTS = [
    { icon: <Gun width={18} />, name: 'Glider Gun', state: GLIDER_GUN },
    { icon: <Gun width={18} />, name: 'Reflector', state: GLIDER_REFLECTOR },
    { icon: <Gun width={18} />, name: 'Eater', state: GLIDER_EATER },
    { icon: <Gun width={18} />, name: 'p60', state: GLIDER_GUN_P60 },

    { icon: <Gun width={18} />, name: 'NOPE_GATE', state: NOPE_GATE },
];

const PaletteItem = styled.div`
    cursor: pointer;
`;

export default class Palette {
    constructor (private sidebar: ReactSidebar, private gameOfLife: GameOfLife, private navigator: Navigator) {
        this.sidebar.onContent.subscribe(() => {
            return (
                <div>
                    {PALETTE_ELEMENTS.map((element, index) => {
                        return (
                            <PaletteItem key={index} onClick={() => this.create(element.state)}>
                                {element.icon} {element.name}
                            </PaletteItem>
                        );
                    })}
                </div>
            );
        });
    }

    private create = (state) => {
        const translate = this.navigator.get();

        const x = Math.floor(translate.x / CELL_SIZE);
        const y = Math.floor(translate.y / CELL_SIZE);

        state.forEach((cell: Point) => {
            this.gameOfLife.put(cell.x - x + 20, cell.y - y + 20);
        });
    }
}
