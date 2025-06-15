export function canMoveTo(allPositioned, from, to) {
  const fromX = from % 8;
  const fromY = Math.floor(from / 8);
  const toX = to % 8;
  const toY = Math.floor(to / 8);

  const deltaX = toX - fromX;
  const deltaY = toY - fromY;

  const isStraight = deltaX === 0 || deltaY === 0;
  const isDiagonal = Math.abs(deltaX) === Math.abs(deltaY);

  if (!isStraight && !isDiagonal) {
    return false;
  }

  const movingCharObj = allPositioned.find((pc) => pc.position === from);
  if (!movingCharObj) return false;

  const type = movingCharObj.character.type;

  let maxDistance = 0;

  if (["swordsman", "undead"].includes(type)) maxDistance = 4;
  else if (["bowman", "vampire"].includes(type)) maxDistance = 2;
  else if (["magician", "daemon"].includes(type)) maxDistance = 1;
  else return false;

  const distance = Math.max(Math.abs(deltaX), Math.abs(deltaY));

  return distance <= maxDistance;
}
