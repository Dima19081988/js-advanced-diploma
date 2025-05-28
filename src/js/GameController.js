import themes from "./themes.js";
import { generateTeam } from "./generators.js";
import PositionedCharacter from "./PositionedCharacter.js";

import Bowman from "./characters/bowman.js";
import Swordsman from "./characters/swordsman.js";
import Magician from "./characters/magician.js";
import Daemon from "./characters/daemon.js";
import Undead from "./characters/undead.js";
import Vampire from "./characters/vampire.js";


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.allPositioned = [];

    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Daemon, Undead, Vampire];

    const playerTeam = generateTeam(playerTypes, 1, 2);
    const enemyTeam = generateTeam(enemyTypes, 1, 2);

    const boardSize = 8;
    const playerPositions = getPlayerPosition (boardSize, playerTeam.characters.length);
    const enemyPositions = getEnemyPosition (boardSize, enemyTeam.characters.length);

    const positionedPlayer = playerTeam.characters
    .map((character, i) => new PositionedCharacter(character, playerPositions[i]));
    const positionedEnemy = enemyTeam.characters
    .map((character, i) => new  PositionedCharacter(character, enemyPositions[i]));
    this.allPositioned = [...positionedPlayer, ...positionedEnemy];

    this.gamePlay.redrawPositions(this.allPositioned);

    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);

    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    const positionChar = this.allPositioned.find(pc => pc.position === index);
    if (positionChar) {
      const { level, attack, defence, health } = positionChar.character;
      const tooltipText = this.characterInfo`${level} ${attack} ${defence} ${health}`;
      this.gamePlay.showCellTooltip(tooltipText, index);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }

  characterInfo(strings, level, attack, defence, health) {
    return `🎖${level} ⚔${attack} 🛡${defence} ❤${health}`;
  }
}

function getPlayerPosition(boardSize, teamSize) {
  const positions = [];
    for (let i = 0; i < boardSize; i++) {
      positions.push(i * boardSize);
      positions.push(i * boardSize + 1);
    }
    return positions.sort(() => Math.random() - 0.5).slice(0, teamSize);
}

function getEnemyPosition(boardSize, teamSize) {
  const positions = [];
    for (let i = 0; i < boardSize; i++) {
      positions.push(i * boardSize + boardSize - 2);
      positions.push(i * boardSize + boardSize - 1);
    }
    return positions.sort(() => Math.random() - 0.5).slice(0, teamSize);
}
