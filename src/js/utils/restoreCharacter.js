import Bowman from "../characters/bowman.js";
import Swordsman from "../characters/swordsman.js";
import Magician from "../characters/magician.js";
import Daemon from "../characters/daemon.js";
import Vampire from "../characters/vampire.js";
import Undead from "../characters/undead.js";

export function restoreCharacter(characterObj) {
    switch (characterObj.type) {
        case 'bowman': return Object.assign(new Bowman(characterObj.level), characterObj);
        case 'swordsman': return Object.assign(new Swordsman(characterObj.level), characterObj);
        case 'magician': return Object.assign(new Magician(characterObj.level), characterObj);
        case 'daemon': return Object.assign(new Daemon(characterObj.level), characterObj);
        case 'vampire': return Object.assign(new Vampire(characterObj.level), characterObj);
        case 'undead': return Object.assign(new Undead(characterObj.level), characterObj);
        default: throw new Error('Неизвестный тип персонажа');
    }
}