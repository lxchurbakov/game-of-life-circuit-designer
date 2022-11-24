import React from 'react';
import styled from 'styled-components';

import ReactSidebar from '/src/ui/react-sidebar';
import GameOfLife, { CELL_SIZE } from '/src/core/game-of-life';
import Navigator from '/src/core/navigator';

import { GLIDER_GUN, GLIDER_REFLECTOR, GLIDER_EATER, GLIDER_GUN_P60,fromRle } from '/src/utils/rle';
import { Point } from '/src/utils/misc';

import { Gun } from '@styled-icons/fa-solid/Gun';

const NOPE_GATE = fromRle(`28bo32b$28bobo30b$11b2o18b2o28b$9bo3bo17b2o4b2o22b$3b2o3bo5bo16b2o4b2o22b$3b2o2b2obo3bo13bobo30b$8bo5bo13bo32b$9bo3bo47b$11b2o48b$61b$61b$61b$61b$61b$61b$61b$10bobo48b$9bo2bo3b2o43b$2o6b2o5b3ob2o2b2o36b$2o4b2o3bo3bo3bo3bobo35b$8b2o5bobo8bo34b$9bo2bo2b2o6bo2bo34b$10bobo13bo34b$23bobo7b2o26b$23b2o8bobo25b$35bo25b$35b2o24b$61b$61b$61b$61b$61b$61b$61b$61b$61b$61b$61b$61b$61b$57b2o2b$57bobob$59bob$59b2o$`);
const REFLECTOR_IN_ACTION = fromRle(`28bo54b$28bobo52b$11b2o18b2o50b$9bo3bo17b2o4b2o44b$3b2o3bo5bo16b2o4b2o44b$3b2o2b2obo3bo13bobo52b$8bo5bo13bo54b$9bo3bo69b$11b2o70b$83b$83b$83b$83b$83b$83b$83b$10bobo70b$9bo2bo3b2o65b$2o6b2o5b3ob2o2b2o58b$2o4b2o3bo3bo3bo3bobo57b$8b2o5bobo8bo56b$9bo2bo2b2o6bo2bo56b$10bobo13bo56b$23bobo7b2o48b$23b2o8bobo47b$35bo47b$35b2o46b$83b$83b$83b$83b$83b$83b$83b$83b$83b$83b$83b$83b$83b$83b$83b$83b$83b$83b$83b$70bo12b$68bobo12b$67bobo13b$66bo2bo11b2o$67bobo11b2o$62b2o4bobo12b$61bobo6bo12b$61bo21b$60b2o21b$`);
const REFLECTOR_IN_ACTION_2 = fromRle(`25bo24b$25bobo22b$8b2o18b2o20b$6bo3bo17b2o4b2o14b$2o3bo5bo16b2o4b2o14b$2o2b2obo3bo13bobo22b$5bo5bo13bo24b$6bo3bo39b$8b2o40b$50b$50b$50b$50b$50b$50b$50b$37bo12b$35bobo12b$34bobo13b$33bo2bo11b2o$34bobo11b2o$29b2o4bobo12b$28bobo6bo12b$28bo21b$27b2o21b$`);

const PALETTE_ELEMENTS = [
    { icon: <Gun width={18} />, name: 'Glider Gun', state: GLIDER_GUN },
    { icon: <Gun width={18} />, name: 'Reflector', state: GLIDER_REFLECTOR },
    { icon: <Gun width={18} />, name: 'Eater', state: GLIDER_EATER },
    { icon: <Gun width={18} />, name: 'p60', state: GLIDER_GUN_P60 },

    { icon: <Gun width={18} />, name: 'NOPE_GATE', state: NOPE_GATE },
    { icon: <Gun width={18} />, name: 'REFLECTOR_IN_ACTION', state: REFLECTOR_IN_ACTION },
    { icon: <Gun width={18} />, name: 'REFLECTOR_IN_ACTION_2', state: REFLECTOR_IN_ACTION_2 },
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
                                {element.name}
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
