import { canMoveTo } from "../utils/canMoveTo";
import { canAttack } from "../utils/canAttack";

describe("Проверка движения персонажей", () => {
  const allPositioned = [
    { position: 0, character: { type: "swordsman" } },
    { position: 10, character: { type: "bowman" } },
    { position: 20, character: { type: "magician" } },
  ];

  test("движение Swordsman", () => {
    expect(canMoveTo(allPositioned, 0, 4)).toBe(true);
    expect(canMoveTo(allPositioned, 0, 32)).toBe(true);
    expect(canMoveTo(allPositioned, 0, 9)).toBe(true);
    expect(canMoveTo(allPositioned, 0, 5)).toBe(false);
    expect(canMoveTo(allPositioned, 0, 10)).toBe(false);
  });

  test("движение Bowman", () => {
    expect(canMoveTo(allPositioned, 10, 12)).toBe(true);
    expect(canMoveTo(allPositioned, 10, 26)).toBe(true);
    expect(canMoveTo(allPositioned, 10, 17)).toBe(true);
    expect(canMoveTo(allPositioned, 10, 13)).toBe(false);
    expect(canMoveTo(allPositioned, 10, 20)).toBe(false);
  });

  test("движение Magician", () => {
    expect(canMoveTo(allPositioned, 20, 21)).toBe(true);
    expect(canMoveTo(allPositioned, 20, 28)).toBe(true);
    expect(canMoveTo(allPositioned, 20, 29)).toBe(true);
    expect(canMoveTo(allPositioned, 20, 22)).toBe(false);
  });
});

describe("Проверка возможности атаки персонажей", () => {
  const allPositioned = [
    { position: 0, character: { type: "swordsman" } },
    { position: 10, character: { type: "bowman" } },
    { position: 20, character: { type: "magician" } },
  ];

  test("атака Swordsman", () => {
    expect(canAttack(allPositioned, 0, 1)).toBe(true);
    expect(canAttack(allPositioned, 0, 2)).toBe(false);
  });

  test("атака Bowman", () => {
    expect(canAttack(allPositioned, 10, 12)).toBe(true);
    expect(canAttack(allPositioned, 10, 15)).toBe(false);
  });

  test("атака Magician", () => {
    expect(canAttack(allPositioned, 20, 24)).toBe(true);
    expect(canAttack(allPositioned, 20, 60)).toBe(false);
  });
});
