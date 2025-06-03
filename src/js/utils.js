export function calcTileType(index, boardSize) {
  const lastIndex = boardSize * boardSize - 1;
  const top = index < boardSize;
  const bottom = index >= boardSize * (boardSize - 1);
  const left = index % boardSize === 0;
  const right = (index + 1) % boardSize === 0;

  if (top && left) return 'top-left';
  if (top && right) return 'top-right';
  if (bottom && left) return 'bottom-left';
  if (bottom && right) return 'bottom-right';
  if (top) return 'top';
  if (bottom) return 'bottom';
  if (left) return 'left';
  if (right) return 'right';
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function characterInfo(strings, level, attack, defence, health) {
    return `🎖${level} ⚔${attack} 🛡${defence} ❤${health}`;
}


