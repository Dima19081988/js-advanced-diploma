import GameController from "../GameController.js";
import GamePlay from "../GamePlay.js";
import GameStateService from "../GameStateService.js";

describe("GameController.load()", () => {
  let gamePlayMock;
  let stateServiceMock;
  let gameController;

  beforeEach(() => {
    global.alert = jest.fn();
    gamePlayMock = {
      addCellEnterListener: jest.fn(),
      addCellLeaveListener: jest.fn(),
      addCellClickListener: jest.fn(),
      addNewGameListener: jest.fn(),
      addSaveGameListener: jest.fn(),
      addLoadGameListener: jest.fn(),
      showError: jest.fn(),
      redrawPositions: jest.fn(),
      drawUi: jest.fn(),
    };
    stateServiceMock = {
      load: jest.fn(),
    };
    gameController = new GameController(gamePlayMock, stateServiceMock);
  });

  test("load должен восстановить состояние и отрисовать позиции", () => {
    const mockState = {
      currentLevel: 2,
      allPositioned: [
        { position: 3, character: { type: "bowman", level: 1, health: 50 } },
      ],
      currentScore: 100,
      maxScore: 200,
      theme: "arctic",
    };

    stateServiceMock.load.mockReturnValue(mockState);

    gameController.loadGame();

    expect(stateServiceMock.load).toHaveBeenCalled();
    expect(gameController.gameState.currentLevel).toBe(2);
    expect(gameController.gameState.currentScore).toBe(100);
    expect(gameController.gameState.maxScore).toBe(200);
    expect(gamePlayMock.drawUi).toHaveBeenCalledWith(expect.any(String));
    expect(gamePlayMock.redrawPositions).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          position: expect.any(Number),
          character: expect.any(Object),
        }),
      ]),
    );
    expect(gamePlayMock.showError).not.toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalledWith("Игра загружена");
  });

  test("load должен показать ошибку и начать новую игру при неуспешной загрузке", () => {
    stateServiceMock.load.mockImplementation(() => {
      throw new Error("Invalid State");
    });
    gameController.startNewGame = jest.fn();
    gameController.loadGame();

    expect(stateServiceMock.load).toHaveBeenCalled();
    expect(gamePlayMock.showError).toHaveBeenCalledWith(
      expect.stringContaining("Ошибка загрузки"),
    );
    expect(gameController.startNewGame).toHaveBeenCalled();
  });
});
