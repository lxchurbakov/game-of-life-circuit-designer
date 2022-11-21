import React from 'react';
import styled from 'styled-components';

import ReactSidebar from '/src/ui/react-sidebar';
import GameOfLife, { CELL_SIZE } from '/src/core/game-of-life';
import Navigator from '/src/core/navigator';

import { parse } from '/src/utils/parse';

import { Gun } from '@styled-icons/fa-solid/Gun';

const PALETTE_ELEMENTS = [
    { icon: <Gun width={18} />, name: 'Glider Gun', pattern: '24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!' },
    { icon: <Gun width={18} />, name: 'Reflector', pattern: '10bo$8bobo$7bobo$6bo2bo11b2o$7bobo11b2o$2b2o4bobo$bobo6bo$bo$2o!' },
    { icon: <Gun width={18} />, name: 'Eater', pattern: '2o2b$obob$2bob$2b2bo!' },
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
                            <PaletteItem key={index} onClick={() => this.create(element.pattern)}>
                                {element.icon} {element.name}
                            </PaletteItem>
                        );
                    })}
                </div>
            );
        });
    }

    private create = (pattern) => {
        const translate = this.navigator.get();

        const x = Math.floor(translate.x / CELL_SIZE);
        const y = Math.floor(translate.y / CELL_SIZE);

        parse(pattern).forEach((cell) => {
            this.gameOfLife.put(cell.x - x + 20, cell.y - y + 20);
        });
    }
}
