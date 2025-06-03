import Character from "../Character.js";

export default class Bowman extends Character {
    constructor(level = 1) {
        super(level, "bowman",);
        this.attack = 25;
        this.defence = 25;
        this.health = 50;

        for (let i = 1; i < level; i++) {
            this.levelUp();
        }
        console.log(`Создан Bowman с уровнем ${this.level}`);
    }

    levelUp() {
        this.level += 1;
        console.log(`Level up: ${this.type} теперь уровень ${this.level}`);
        this.attack = Math.max(
            this.attack,
            Math.floor(this.attack * (80 + this.health) / 100)
        );
        this.defence = Math.max(
            this.defence,
            Math.floor(this.defence * (80 + this.health) / 100)
        );
        this.health = Math.min(100, this.level + 80);
    }
}