export function toTitleCase(str: string) {
  const parts = str.split(" ");
  parts.forEach((part, i) => {
    parts[i] = part.charAt(0).toUpperCase() + part.substring(1);
  })
  return parts.join(" ");
}

export function abbrAbility(str: string) {
  const inverseMap = new Map([...abilityMap].map(([k,v]) => [v,k]));
  return inverseMap.has(str) ? inverseMap.get(str) : str;
}

export function abilityFromAbbr(str: string) {
  return abilityMap.has(str) ? abilityMap.get(str) : str;
}

const abilityMap = new Map([
  ["str", "Strength"],
  ["dex", "Dexterity"],
  ["con", "Constitution"],
  ["int", "Intelligence"],
  ["wis", "Wisdom"],
  ["cha", "Charisma"],
  ["pow", "Power"],
  ["pre", "Precision"],
  ["dur", "Durability"],
  ["spd", "Speed"],
  ["rng", "Range"],
  ["se", "Stand Energy"]
]);