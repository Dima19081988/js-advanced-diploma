export function* characterGenerator(allowedTypes, maxLevel) {
  while(true) {
    const TypeClass = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    const level = Math.floor(Math.random() * maxLevel) + 1;
    yield new TypeClass(level, maxLevel);
  }

}

import Team from "./Team.js";

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const generator = characterGenerator(allowedTypes, maxLevel);
  const team = [];
  for (let i = 0; i < characterCount; i++) {
    team.push(generator.next().value);
  }
  return new Team(team);
}
