import { characterInfo } from "../utils";

describe ('characterInfo - tagged template', () => {
    test ('форматируется строку с характеристиками персонажа', () => {
        const level = 1;
        const attack = 40;
        const defence = 10;
        const health = 50;

        const result = characterInfo`${level} ${attack} ${defence} ${health}`;

        expect(result).toBe('🎖1 ⚔40 🛡10 ❤50');
    });

    test('корректно работает с другмии значениями', () => {
        const level = 5;
        const attack = 20;
        const defence = 40;
        const health = 100;

        const result = characterInfo`${level} ${attack} ${defence} ${health}`;

        expect(result).toBe('🎖5 ⚔20 🛡40 ❤100');
    });
});