import Character from "../Character.js";

export default class Daemon extends Character {
    constructor(level = 1) {
        super(level, "daemon"); 
        this.attack = 10;
        this.defence = 10;
        this.health = 50;

        for (let i = 1; i < level; i++) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level += 1;
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