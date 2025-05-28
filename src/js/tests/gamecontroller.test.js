import Character from "../Character.js";
import Bowman from "../characters/bowman.js";
import Swordsman from "../characters/swordsman.js";
import { characterGenerator } from "../generators.js";
import { generateTeam } from "../generators.js";

test ('Character: нельзя создавать новый объект напрямую', () => {
    expect(() => new Character(1)).toThrow();
});

test ('Можно создать имеющийся класс', () => {
    expect(() => new Bowman(1)).not.toThrow();
});

test ('Правильные характеристики персонажей 1 уровня', () => {
    const swordsman = new Swordsman(1);
    expect(swordsman.level).toBe(1);
    expect(swordsman.attack).toBe(40);
    expect(swordsman.defence).toBe(10);
    expect(swordsman.type).toBe('swordsman');
});

test('characterGenerator выдает персонажей из allowedTypes', () => {
    const allowed = [Bowman, Swordsman];
    const gen = characterGenerator(allowed, 1);
    for (let i = 0; i <= 10; i++) {
        const character = gen.next().value;
        expect(character instanceof Bowman || 
            character instanceof Swordsman).toBe(true);
        expect(['bowman', 'swordsman']).toContain(character.type);
    };
});

test('generateTeam: количество и уровень персонажей', () => {
    const maxLevel = 3;
    const teamSize = 5;
    const allowedTypes = [Bowman, Swordsman];

    const team = generateTeam(allowedTypes, maxLevel, teamSize);

    expect(team.characters.length).toBe(teamSize);

    for (const character of team.characters) {
        expect(character instanceof Bowman || 
            character instanceof Swordsman).toBe(true);
        expect(character.level).toBeGreaterThanOrEqual(1);
        expect(character.level).toBeLessThanOrEqual(maxLevel);
    }
});