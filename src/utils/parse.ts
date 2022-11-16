/**
 * Parser for game of life configurations like
 * 24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o! (Gosper Gun)
 */
const isDigit = (s: string) => 
    '0123456789'.indexOf(s) > -1;

const splitIntoTokens = (rle: string) => {
    let buffer = 1;
    
    return rle.split('').reduce((acc, token) => {
        if (isDigit(token) && acc.length > 0 && isDigit(acc[acc.length - 1])) {
            acc[acc.length-1] += token;
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

export const parse = (rle: string) => {
    let y = 0;
    let x = 0;

    return splitIntoTokens(rle).reduce((acc, token) => {
        if (token.type === '$') {
            y++;
            x=0;
        }

        if (token.type === 'b') {
            x += token.count;
        }

        if (token.type === 'o') {
            for (let i = 0; i < token.count; ++i) {
                acc.push({ x: x + i, y });
            }
            x += token.count;
        }

        return acc;
    }, []);
};
