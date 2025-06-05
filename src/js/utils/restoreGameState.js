// import { restoreCharacter } from "./restoreCharacter.js";
// import PositionedCharacter from "../PositionedCharacter.js";
// import GameState from "../GameState.js";
// export function restoreGameState(state) {
//     const gameState = GameState.from(state);

//     const allPositioned = gameState.allPositioned.map(item => {
//         const character = restoreCharacter(item.character);
//         return new PositionedCharacter(character, item.position);
//     });

//     return {
//         gameState,
//         allPositioned,
//         currentScore: gameState.currentScore,
//         maxScore: gameState.maxScore,
//         theme: gameState.theme,
//     };
// }