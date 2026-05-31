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
      updateScore(newChar, change.field.replace("-score", ""), (change.newState as number | undefined ?? 0) - (change.prevState as number | undefined ?? 0));

    switch (change.field) {
      case "selectedAct":
        if (char.data.class == "act") {
          const prefix = `act${change.newState}-`;
          ["str", "dex", "con", "int", "wis", "cha"].forEach(stat => {
          console.log(`${prefix}-${stat}-score`)
            updateDataField(newChar, `S${stat}-score` as keyof CharacterData, char.data[`${prefix}${stat}-score` as keyof CharacterData]);
            updateDataField(newChar, `S${stat}-mod` as keyof CharacterData, char.data[`${prefix}${stat}-mod` as keyof CharacterData]);
          });
        }
        break;
      case "act4Base":
        const prefix = `act${(change.newState as string).replace("act", "")}-`;
        ["str", "dex", "con", "int", "wis", "cha"].forEach(stat => {
          updateDataField(newChar, `act4-${stat}-score` as keyof CharacterData, parseInt(char.data[`${prefix}${stat}-score` as keyof CharacterData] as string | undefined ?? "0") * 2);
          updateMod(newChar, `${stat}`, 4);
        });
    }
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

const characterClasses: Record<string, string> = {pow: "Power-Type", rng: "Ranged-Type", rmt: "Remote-Type", abl: "Ability-Type", enh: "Enhancement-Type", rev: "Revenge-Type", ind: "Independent-Type", hive: "Hive-Type", act: "Act-Type", rip: "Ripple", spin: "Spin", art: "Artisan", ass: "Assassin", con: "Consul", heav: "Heavyweight", ran: "Ranger", sch: "Scholar", war: "Warrior", multi: "Other/Multiple"};

function updateScore(char: Character, stat: string, diff: number) {
  if (!/^(act\d-)?S.*/.test(stat) && diff != 0) { //non-stand score changed
    if (char.data.class == "act")
      updateActScores(char, `${stat}`, diff);
    else
      updateStandScore(char, `S${stat}`, diff);
  }
  updateMod(char, stat);
}

function updateStandScore(char: Character, stat: string, diff: number) {
  const mults = (getClassData(characterClasses[char.data.class]))?.mults;
  const statIndex = ["Sstr", "Sdex", "Scon", "Sint", "Swis", "Scha"].indexOf(stat);
  if (!mults)
    return;
  const currentScore = parseInt(char.data[`${stat}-score` as keyof CharacterData] as string) ?? 0;
  updateDataField(char, `${stat}-score` as keyof CharacterData, currentScore + diff * mults[statIndex]);
  updateMod(char, stat);
}

function updateActScores(char: Character, stat: string, diff: number, act?: number) {
  if (!/^...$/.test(stat))
    return;
  const typesContent = getClassData("Act-Type")!.other![0]!.content[1]; //TODO: getting this out of text content is gross but better than having it in two separate places, consider moving this list elsewhere
  const multMatches = [...typesContent.matchAll(/(?<=x)[0-9]+/gm)].map(m => m[0]);
  console.log(multMatches);
  [1,2,3,4].forEach(i => {
    if (!act || i == act) {
      const base = i == 4 ? parseInt(char.data.act4Base?.replace("act", "")) ?? "3" : i;
      const defaultTypes = ["long", "ability", "close", "close"];
      const type = char.data[`act${base}Type` as keyof CharacterData] ?? defaultTypes[i - 1];
      const currentScore = parseInt(char.data[`act${i}-${stat}-score` as keyof CharacterData] as string | undefined ?? "0");
      const act4Mult = i == 4 ? 2 : 1;
      const statIndex = ["str", "dex", "con", "int", "wis", "cha"].indexOf(stat);
      switch (type) {
        case "close":
          updateDataField(char, `act${i}-${stat}-score` as keyof CharacterData, currentScore + diff * parseInt(multMatches.slice(0, 6)[statIndex]) * act4Mult);
          break;
        case "long":
          updateDataField(char, `act${i}-${stat}-score` as keyof CharacterData, currentScore + diff * parseInt(multMatches.slice(6, 12)[statIndex]) * act4Mult);
          break;
        case "ability":
          updateDataField(char, `act${i}-${stat}-score` as keyof CharacterData, currentScore + diff * parseInt(multMatches.slice(18, 24)[statIndex]) * act4Mult);
          break;
        case "remote":
          updateDataField(char, `act${i}-${stat}-score` as keyof CharacterData, currentScore + diff * parseInt(multMatches.slice(12, 18)[statIndex]) * act4Mult);
          break;
        default:
          break;
      }
      updateMod(char, stat, i);
    }
  });
}

function updateMod(char: Character, stat: string, act?: number) {
  const actPrefix = act ? `act${act}-` : "";
  const score = parseInt(char.data[`${actPrefix}${stat}-score` as keyof CharacterData] as string | undefined ?? "0");
  const mod = isNaN(score) || score == 0 ? "" : act || /^S.*/.test(stat) ? Math.floor(score / 10) : Math.floor((score - 10) / 2);
  const modSign = !mod || mod <= 0 ? "" : "+";
  updateDataField(char, `${actPrefix}${stat}-mod` as keyof CharacterData, `${modSign}${mod}`);
}