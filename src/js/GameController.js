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
    this.isGameActive = true;
    this.currentScore = 0;
    this.maxScore = 0;
    this.allPositioned = [];
    this.gameState = new GameState();
    this.themes = [themes.prairie, themes.arctic, themes.desert, themes.mountain];
    this.currentLevel = 1;
    this.playerTypes = ['swordsman', 'bowman', 'magician'];
    this.enemyTypes = ['daemon', 'undead', 'vampire'];

    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.gamePlay.addNewGameListener(() => this.startNewGame());
    this.gamePlay.addSaveGameListener(() => this.saveGame());
    this.gamePlay.addLoadGameListener(() => this.loadGame());
  }
//загрузка сохраненного состояния
  async initializeGame() {
    try {
      const savedState = this.stateService.load();
      if (savedState) {
        this.restoreGameSave(savedState);
      } else {
        this.startNewGame();
      }
    } catch(error) { 
      GamePlay.showError('Ошибка загрузки');
      this.startNewGame();
    }
  }
//восстновление состояния
  restoreGameSave(state) {
    this.gameState = GameState.from(state);
    this.allPositioned = state.allPositioned
    .map(pc => new PositionedCharacter(pc.character, pc.position));
    this.isGameActive = true;
    this.gamePlay.drawUi(this.themes[(this.gameState.currentLevel - 1) % this.themes.length]);
    this.gamePlay.redrawPositions(this.allPositioned);

    this.currentScore = this.gameState.currentScore;
    this.maxScore = this.gameState.maxScore;
  }
//сохранение/загрузка состояния
  saveGame() {
    try { 
      const state = new GameState({
        currentLevel: this.gameState.currentLevel,
        currentPlayer: this.gameState.currentPlayer,
        allPositioned: this.allPositioned,
        currentScore: this.currentScore,
        maxScore: this.maxScore,
        theme: this.themes[(this.gameState.currentLevel - 1) % this.themes.length],
      });
      this.stateService.save(state);
    } catch(error) {
      GamePlay.showError('Ошибка сохранения: ' + error.message);
    };
  }

  loadGame() {
    try {
      const savedState = this.stateService.load();
      if (savedState) {
        this.restoreGameSave(savedState);
        alert('Игра загружена');
      } else {
        alert('Сохранений не найдено');
      }
    } catch(error) {
      GamePlay.showError('Ошибка загрузки: '+ error.message);
    }
  }

//запуск новой игры
  startNewGame() {
    this.isGameActive = true;
    this.currentScore = 0;
    this.maxScore = this.maxScore || 0;
    this.gameState = new GameState({
      currentLevel: 1,
      currentPlayer: 'player',
      currentScore: this.currentScore,
      maxScore: this.maxScore,
      theme: this.themes[0]
    })
    this.allPositioned = [];
    this.init(1)
  }

  init(level) {
    this.gameState.currentLevel = level;
    this.gamePlay.drawUi('prairie');

    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Daemon, Undead, Vampire];

    const playerTeam = generateTeam(playerTypes, 1, 2);
    const enemyTeam = generateTeam(enemyTypes, 1, 2);

    for (const character of playerTeam.characters) {
    console.log(character.type, character.level);
    }

    for (const character of enemyTeam.characters) {
    console.log(character.type, character.level);
    }

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

    this.gameState.currentPlayer = 'player';
  }

  onCellClick(index) {
    if (!this.isGameActive) {
      return;
    }
// не твой ход
    if (this.gameState.currentPlayer !== 'player') {
      GamePlay.showError('Сейчас не ваш ход');
      return;
    }

    const positionChar = this.allPositioned.find(pc => pc.position === index);

//твой ход
    if (positionChar && ['bowman', 'swordsman', 'magician']
      .includes(positionChar.character.type)) {
        if(this.selectedCellIndex !== undefined) {
           this.gamePlay.deselectCell(this.selectedCellIndex);
        }
        this.selectedCellIndex = index;
        this.gamePlay.selectCell(index, 'yellow');
        return;
    }

// реализация атаки врага
    if(this.selectedCellIndex !== undefined
      && positionChar
      && ['daemon', 'undead', 'vampire'].includes(positionChar.character.type)
      && canAttack(this.allPositioned, this.selectedCellIndex, index)
    ) {
      const attacker = this.allPositioned.find(pc => pc.position === this.selectedCellIndex).character;
      const target = positionChar.character;
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
      target.health -= damage;

      this.gamePlay.showDamage(index, damage).then (() => {
        if(target.health <= 0) {
          this.allPositioned = this.allPositioned.filter(pc => pc.position != index);
        }
        this.gamePlay.redrawPositions(this.allPositioned);
        for (let i = 0; i < 64; i++) {
          this.gamePlay.deselectCell(i);
        }
        this.selectedCellIndex = undefined;
        const enemiesLeft = this.allPositioned.some(pc => this.enemyTypes
          .includes(pc.character.type));
        if (!enemiesLeft) {
          this.startNewLevel();
          return;
        }
        this.gameState.currentPlayer = 'enemy';
        this.saveGame();
        setTimeout(() => this.computerTurn(), 500);
      });

      return;
    }

// перемещение выбранного персонажа
    if (this.selectedCellIndex !== undefined && !positionChar) {
      if(canMoveTo(this.allPositioned, this.selectedCellIndex, index)) {
        const characterToMove = this.allPositioned.find(pc => pc.position === this.selectedCellIndex);
        characterToMove.position = index;
        for (let i = 0; i < 64; i++) {
          this.gamePlay.deselectCell(i);
        }
        this.selectedCellIndex = undefined;
        this.gamePlay.redrawPositions(this.allPositioned);

        this.gameState.currentPlayer = 'enemy';
        this.saveGame();
        setTimeout(() => this.computerTurn(), 500);
        return;
      } else {
        GamePlay.showError('Недопустимый ход');
        return;
      }
    }

// выбор персонажа врага
//     if (!positionChar || !['bowman', 'swordsman', 'magician']
//       .includes(positionChar.character.type)) {
//         GamePlay.showError('Выберите своего персонажа');
//         return;
//     }
    
// недопустимое действие (ход, атака)
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

//условие атаки
    if(positionChar && ['daemon', 'undead', 'vampire'].includes(positionChar.character.type)
       && canAttack(this.allPositioned, this.selectedCellIndex, index)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
      this.gamePlay.hideCellTooltip(index);
      return;
    }

//условие перемещания
    if(canMoveTo(this.allPositioned, this.selectedCellIndex, index)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
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

  computerTurn() {
    const enemies = this.allPositioned.filter(pc => ['daemon', 'undead', 'vampire']
      .includes(pc.character.type));
    const players = this.allPositioned.filter(pc => ['swordsman', 'bowman', 'magician']
      .includes(pc.character.type));
//атака противника
    for (const enemy of enemies) {
      for (const player of players) {
        if (canAttack(this.allPositioned, enemy.position, player.position)) {
          const attacker = enemy.character;
          const target = player.character;
          const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
          target.health -= damage;
          this.gamePlay.showDamage(player.position, damage).then(() => {
            if (target.health <= 0) {
              this.allPositioned = this.allPositioned.filter(pc => pc.position !== player.position);
            }
            this.gamePlay.redrawPositions(this.allPositioned);
            const playersLeft = this.allPositioned.some(pc => this.playerTypes
              .includes(pc.character.type));
            if(!playersLeft) {
              this.startNewLevel();
              return;
            }
            this.gameState.currentPlayer = 'player';

            this.saveGame();
          })

          return;
        }
      }
    }
//перемещение противника, если атака невозможна
    for (const enemy of enemies) {
      for (let i = 0; i < 64; i++) {
        if (!this.allPositioned.some(pc => pc.position === i) 
          && canMoveTo(this.allPositioned, enemy.position, i)) {
            enemy.position = i;
            this.gamePlay.redrawPositions(this.allPositioned);
            this.gameState.currentPlayer = 'player';
            this.saveGame();
            return;
        }
      }
    }
    this.gameState.currentPlayer = 'player';
  }

//повышение уровня команды
  levelUpTeam() {
    for (const pc of this.allPositioned) {
      if (this.playerTypes.includes(pc.character.type)) {
        pc.character.level += 1;
        pc.character.attack = Math.max(
          pc.character.attack,
          Math.floor(pc.character.attack * (80 + pc.character.health) / 100)
        );
        pc.character.defence = Math.max(
          pc.character.defence,
          Math.floor(pc.character.defence * (80 + pc.character.health) / 100)
        );
        pc.character.health = Math.min(100, pc.character.level + 80);
      }
    }
  }
//старт нового уровня
  startNewLevel() {
    if (this.currentLevel >= 4) {
      this.endGame();
      return;
    }
    this.currentLevel += 1;
    const theme = this.themes[(this.currentLevel - 1) % this.themes.length];
    this.gamePlay.drawUi(theme);

    this.levelUpTeam();

    const players = this.allPositioned.filter(pc => this.playerTypes.includes(pc.character.type));
    const playerCount = Math.max(players.length, 2);
    const enemyTypes = [Daemon, Undead, Vampire];
    const enemyTeam = generateTeam(enemyTypes, this.currentLevel, playerCount)

    const boardSize = 8;
    const playerPositions = getPlayerPosition (boardSize, players.length);
    const enemyPositions = getEnemyPosition (boardSize, enemyTeam.characters.length);
    players.forEach((pc, i) => {
      pc.position = playerPositions[i];
    });
    const positionedPlayer = players.map((pc, i) => {
      pc.position = playerPositions[i];
      return pc;
    })
    const positionedEnemy = enemyTeam.characters
    .map((character, i) => new PositionedCharacter(character, enemyPositions[i]));
    
    this.allPositioned = [...positionedPlayer, ...positionedEnemy];

    this.gamePlay.redrawPositions(this.allPositioned);
    this.selectedCellIndex = undefined;
    this.gameState.currentPlayer = 'player';
  }
//Блокировка поля
  blockGame() {
    this.isGameActive = false;
    this.gamePlay.setCursor('default');
  }
//конец игры
  endGame() {
    this.blockGame();
    if (this.currentScore > this.maxScore) {
      this.maxScore = this.currentScore;
    }
    this.saveGame();
    alert(`Игра окончена: ваш счет: ${this.currentScore}, лучший счет: ${this.maxScore}`);
  };
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
