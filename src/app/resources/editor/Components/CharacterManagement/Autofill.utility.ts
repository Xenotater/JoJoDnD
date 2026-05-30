import { cloneDeep } from "lodash";
import { Character, CharacterData, EditState } from "../../../../Models/Characters.model";
import { getClassData } from "@/app/Utilities/content.utility";

export default function doAutofill(char: Character, changes: EditState) {
  console.log("running autofill...");
  const newChar = cloneDeep(char);
  for (const change of changes) {
    console.log("checking:");
    console.log(change);
    if (change.field.includes("-score"))
      updateScore(newChar, change.field.replace("-score", "") as CharacterStat, (change.newState as number) - (change.prevState as number));
  }
  return newChar;  
}

function updateDataField(char: Character, field: keyof CharacterData, value: unknown) {
  console.log("setting " + field + " to: " + value);
  char.data = {
    ...char.data,
    [field]: value
  }
}

type CharacterStat = "str" | "dex" | "con" | "int" | "wis" | "cha" | "Sstr" | "Sdex" | "Scon" | "Sint" | "Swis" | "Scha";
const characterClasses: Record<string, string> = {pow: "Power-Type", rng: "Ranged-Type", rmt: "Remote-Type", abl: "Ability-Type", enh: "Enhancement-Type", rev: "Revenge-Type", ind: "Independent-Type", hive: "Hive-Type", act: "Act-Type", rip: "Ripple", spin: "Spin", art: "Artisan", ass: "Assassin", con: "Consul", heav: "Heavyweight", ran: "Ranger", sch: "Scholar", war: "Warrior", multi: "Other/Multiple"};

function updateScore(char: Character, stat: CharacterStat, diff: number) {
  if (!/^S.*/.test(stat) && diff != 0) { //non-stand score changed
    updateStandScore(char, `S${stat}` as CharacterStat, diff);
  }
  updateMod(char, stat);
}

function updateStandScore(char: Character, stat: CharacterStat, diff: number) {
  const mults = (getClassData(characterClasses[char.data.class]))?.mults;
  const index = ["Sstr", "Sdex", "Scon", "Sint", "Swis", "Scha"].indexOf(stat);
  if (!mults)
    return;
  const currentScore = parseInt(char.data[`${stat}-score`]) ?? 0;
  updateDataField(char, `${stat}-score`, currentScore + diff * mults[index]);
  updateMod(char, stat);
}

function updateMod(char: Character, stat: CharacterStat) {
  const score = parseInt(char.data[`${stat}-score`]) ?? 0;
  const mod = /^S.*/.test(stat) ? Math.floor(score / 10) : Math.floor((score - 10) / 2);
  const modSign = mod <= 0 ? "" : "+";
  updateDataField(char, `${stat}-mod`, `${modSign}${mod}`);
}