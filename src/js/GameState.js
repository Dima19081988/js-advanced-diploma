export default class GameState {
  constructor({
    currentLevel = 1,
    currentPlayer = 'player',
    allPositioned = [],
    currentScore = 0,
    maxScore = 0,
    theme = 'prairie',
  } = {}) {
    this.currentLevel = currentLevel;
    this.currentPlayer = currentPlayer;
    this.allPositioned = allPositioned;
    this.currentScore = currentScore;
    this.maxScore = maxScore;
    this.theme = theme;
  }

  static from(object) {
    return new GameState({
      currentLevel: object.currentLevel,
      currentPlayer: object.currentPlayer,
      allPositioned: object.allPositioned,
      currentScore: object.currentScore,
      maxScore: object.maxScore,
      theme: object.theme
    });
  }

  toJSON() {
    return {
      currentLevel: this.currentLevel,
      currentPlayer: this.currentPlayer,
      allPositioned: this.allPositioned,
      currentScore: this.currentScore,
      maxScore: this.maxScore,
      theme: this.theme
    }
  }
}
