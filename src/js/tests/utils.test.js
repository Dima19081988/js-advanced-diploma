import { calcTileType } from "../utils.js";

describe ('calcTileType', () => {
    const boardSize = 8;

    test ('top-left', () => {
        expect(calcTileType(0, boardSize)).toBe('top-left');
    });

    test ('top-right', () => {
        expect(calcTileType(7, boardSize)).toBe('top-right');
    });

    test ('bottom-left', () => {
        expect(calcTileType(56, boardSize)).toBe('bottom-left');
    });

     test ('bottom-right', () => {
        expect(calcTileType(63, boardSize)).toBe('bottom-right');
    });

     test ('top', () => {
        expect(calcTileType(4, boardSize)).toBe('top');
    });

     test ('right', () => {
        expect(calcTileType(15, boardSize)).toBe('right');
    });

     test ('bottom', () => {
        expect(calcTileType(58, boardSize)).toBe('bottom');
    });

    test ('left', () => {
        expect(calcTileType(8, boardSize)).toBe('left');
    });
})