export function canAttack(allPositioned, from, to) {
    const fromX = from % 8;
    const fromY = Math.floor(from / 8);
    const toX = to % 8;
    const toY = Math.floor(to / 8);

    const deltaX = Math.abs(toX - fromX);
    const deltaY = Math.abs(toY - fromY);

    const distance = Math.max(deltaX, deltaY);

    const attacker = allPositioned.find(pc => pc.position === from);
    if (!attacker) return false;

    const type = attacker.character.type;

    let attackRange = 0;
    if (['swordsman', 'undead'].includes(type)) attackRange = 1;
    else if (['bowman', 'vampire'].includes(type)) attackRange = 2;
    else if (['magician', 'daemon'].includes(type)) attackRange = 4;
    else return false;

    return distance <= attackRange;
}