export function toTitleCase(str: string) {
  const parts = str.split(/[ \-]/);
  parts.forEach((part, i) => {
    parts[i] = part.charAt(0).toUpperCase() + part.substring(1);
  });
  return parts.join(" ");
}

export function abbrAbility(str: string) {
  const inverseMap = new Map([...abilityMap].map(([k, v]) => [v, k]));
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
  ["se", "Stand Energy"],
]);

export function formToJson<T>(data: {name: string; value: string}[]) {
  return data.reduce((obj: T, item: {name: string; value: string}) => ({[item.name]: item.value, ...obj}), {} as T) as T;
}

export function jsonToForm<T>(data: T) {
  return Object.keys(data as object).map((k) => ({name: k, value: data[k as keyof T]}));
}

export function base64ToFile(fileData: string, fileName: string) {
  const parts = fileData.split(',');
  const typeMatch = parts[0].match(/:(.*?);/);
  const type = typeMatch ? typeMatch[1] : 'image/webp';
  const data = atob(fileData.replace(/^data:.+;base64,/, ""));
  const dataArr = new Uint8Array(data.length);

  for (let i = 0; i < dataArr.length; i++) {
    dataArr[i] = data.charCodeAt(i);
  }

  return new File([dataArr], fileName, {type: type});
}

export function fileToFormData(file: File) {
  const fileData = new FormData();
  fileData.append("file", file);
  return fileData;
}