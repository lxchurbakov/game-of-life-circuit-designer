import { Point } from './misc';

const isDigit = (s: string) =>
    '0123456789'.indexOf(s) > -1;

const splitIntoTokens = (rle: string) => {
    let buffer = 1;

    return rle.split('').reduce((acc, token) => {
        if (isDigit(token) && acc.length > 0 && isDigit(acc[acc.length - 1])) {
            acc[acc.length - 1] += '' + token;
            return acc;
        } else {
            return acc.concat([token]);
        }
    }, []).reduce((acc, token) => {
        if (token === '$') {
            return acc.concat([{ type: '$' }]);
        } else if (token === '!') {
            return acc.concat([{ type: '!' }]);
        } else if (token === 'b') {
            const count = buffer;
            buffer = 1;
            return acc.concat([{ count, type: 'b' }]);
        } else if (token === 'o') {
            const count = buffer;
            buffer = 1;
            return acc.concat([{ count, type: 'o' }]);
        } else {
            buffer = parseInt(token, 10) || 1;
            return acc;
        }
    }, []);
};

export const fromRle = (rle: string, offset: { x: number, y: number } = { x: 0, y: 0 }) => {
    let y = 0;
    let x = 0;

    return splitIntoTokens(rle).reduce((acc, token) => {
        if (token.type === '$') {
            y++;
            x = 0;
        }

        if (token.type === 'b') {
            x += token.count;
        }

        if (token.type === 'o') {
            for (let i = 0; i < token.count; ++i) {
                acc.push({ x: x + i + offset.x, y: y + offset.y });
            }
            x += token.count;
        }

        return acc;
    }, []);
};

export const fromDots = (dots: string) => {
    return fromRle(dots.split('').filter((v) => v === '.' || v === 'O' || v === "\n").map((char, i) => {
        if (char === '.') {
            return 'b';
        } else if (char === "\n") {
            return '$';
        } else {
            return 'o';
        }
    }).join(''));
};

export const toRle = (cells: Point[]) => {
    const left = cells.reduce((acc, c) => Math.min(acc, c.x), Infinity);
    const right = cells.reduce((acc, c) => Math.max(acc, c.x), -Infinity);
    const top = cells.reduce((acc, c) => Math.min(acc, c.y), Infinity);
    const bottom = cells.reduce((acc, c) => Math.max(acc, c.y), -Infinity);

    let rle = [];

    for (let y = top; y <= bottom; ++y) {
        for (let x = left; x <= right; ++x) {
            rle.push(cells.findIndex((c) => c.x === x && c.y === y) > -1 ? 'o' : 'b');
        }

        rle.push('$');
    }

    return rle.reduce((acc, token) => {
        if (acc.length > 0 && acc[acc.length - 1].type === token) {
            acc[acc.length - 1].count++;
            return acc;
        } else {
            return acc.concat([{ type: token, count: 1 }]);
        }
    }, []).map((token) => {
        return token.count > 1 ? (token.count + token.type) : token.type;
    }).join('');
};

// Few components that can be used

export const GLIDER_GUN = fromRle('24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!');
export const GLIDER = fromRle('bo$2bo$3o!');
export const GLIDER_REFLECTOR = fromRle('10bo$8bobo$7bobo$6bo2bo11b2o$7bobo11b2o$2b2o4bobo$bobo6bo$bo$2o!');
export const GLIDER_EATER = fromRle('2o2b$obob$2bob$2b2o$');

export const GLIDER_GUN_P60 = fromDots(`
............................O..........
............................O.O........
...........OO..................OO......
.........O...O.................OO....OO
...OO...O.....O................OO....OO
...OO..OO.O...O.............O.O........
........O.....O.............O..........
.........O...O.........................
...........OO..........................
.......................................
.......................................
.......................................
.......................................
.......................................
.......................................
.......................................
..........O.O..........................
.........O..O...OO.....................
OO......OO.....OOO.OO..OO..............
OO....OO...O...O...O...O.O.............
........OO.....O.O........O............
.........O..O..OO......O..O............
..........O.O.............O............
.......................O.O.......OO....
.......................OO........O.O...
...................................O...
...................................OO..
`);
