import themes from "./themes.js";
import cursors from "./cursors.js";
import { generateTeam } from "./generators.js";
import { characterInfo } from "./utils.js";
import { canMoveTo } from "./utils/canMoveTo.js";
import { canAttack } from "./utils/canAttack.js";
import PositionedCharacter from "./PositionedCharacter.js";
import GameState from "./GameState.js";
import Bowman from "./characters/bowman.js";
import Swordsman from "./characters/swordsman.js";
import Magician from "./characters/magician.js";
import Daemon from "./characters/daemon.js";
import Undead from "./characters/undead.js";
import Vampire from "./characters/vampire.js";
import GamePlay from "./GamePlay.js";


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.allPositioned = [];
    this.gameState = new GameState();
    this.playerTypes = [Swordsman, Bowman, Magician];
    this.enemyTypes = [Daemon, Undead, Vampire];
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
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
    this.gamePlay.addCellClickListener(this.onCellClick);
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    if (this.gameState.currentPlayer !== 'player') {
      GamePlay.showError('Сейчас не ваш ход');
      return;
    }

    const positionChar = this.allPositioned.find(pc => pc.position === index);

    if (!positionChar || !['bowman', 'swordsman', 'magician']
      .includes(positionChar.character.type)) {
        GamePlay.showError('Выберите своего персонажа');
        return;
      }

    if(this.selectedCellIndex !== undefined) {
      this.gamePlay.deselectCell(this.selectedCellIndex);
    }
    
    this.selectedCellIndex = index;
    this.gamePlay.selectCell(index, 'yellow');

    if(this.isInvalidAction(this.selectedCellIndex, index)) {
      alert('Недопустимое действие, выберете другую клетку');
      return;
    }
  }


  onCellEnter(index) {
    const positionChar = this.allPositioned.find(pc => pc.position === index);

//если персонаж не выбран
    if(!this.selectedCellIndex) {
      if (positionChar && ['bowman', 'swordsman', 'magician']
        .includes(positionChar.character.type)) {
        const { level, attack, defence, health } = positionChar.character;
        const tooltipText = characterInfo`${level} ${attack} ${defence} ${health}`;
        this.gamePlay.showCellTooltip(tooltipText, index);
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.hideCellTooltip(index);
        this.gamePlay.setCursor(cursors.auto);
      }
    return;
    }
// если персонаж выбран, его подсветка не меняется
    if(index === this.selectedCellIndex) {
      if(positionChar) {
        const { level, attack, defence, health } = positionChar.character;
        const tooltipText = characterInfo`${level} ${attack} ${defence} ${health}`;
        this.gamePlay.showCellTooltip(tooltipText, index);
      }
      this.gamePlay.setCursor(cursors.auto);
      return;
    }

// если персонаж, выбран, но наводим курсор на другого персонажа
    if (positionChar && ['bowman', 'swordsman', 'magician']
      .includes(positionChar.character.type) 
      && positionChar.position !== this.selectedCellIndex) {
      const { level, attack, defence, health } = positionChar.character;
      const tooltipText = characterInfo`${level} ${attack} ${defence} ${health}`;
      this.gamePlay.showCellTooltip(tooltipText, index);
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }

//условие перемещания
    if(canMoveTo(this.allPositioned, this.selectedCellIndex, index)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
      this.gamePlay.hideCellTooltip(index);
      return;
    }

//условие атаки
    if(positionChar && this.enemyTypes.includes(positionChar.character.type)
       && canAttack(this.allPositioned, this.selectedCellIndex, index)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
      this.gamePlay.hideCellTooltip(index);
      return;
    }

    this.gamePlay.setCursor(cursors.notallowed);
    this.gamePlay.hideCellTooltip(index);
  }

  onCellLeave(index) {
    if (this.selectedCellIndex !== index) {
    this.gamePlay.deselectCell(index);
      }
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.hideCellTooltip(index);
  }

  isInvalidAction(from, to) {
    const attackPossible = canAttack(this.allPositioned, from, to);
    const movePossible = canMoveTo(this.allPositioned, from, to);
    return !(movePossible || attackPossible);
  }

}
//получение позиции игрока
function getPlayerPosition(boardSize, teamSize) {
  const positions = [];
    for (let i = 0; i < boardSize; i++) {
      positions.push(i * boardSize);
      positions.push(i * boardSize + 1);
    }
    return positions.sort(() => Math.random() - 0.5).slice(0, teamSize);
}
//получение позиции врага
function getEnemyPosition(boardSize, teamSize) {
  const positions = [];
    for (let i = 0; i < boardSize; i++) {
      positions.push(i * boardSize + boardSize - 2);
      positions.push(i * boardSize + boardSize - 1);
    }
    return positions.sort(() => Math.random() - 0.5).slice(0, teamSize);
}
