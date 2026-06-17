import { cloneDeep } from "lodash";
import { Character, CharacterData, EditState } from "../../../../Models/Characters.model";
import { getClassData } from "@/app/Utilities/content.utility";

type DataField = keyof CharacterData;

export default function doAutofill(initChar: Character, changes: EditState) {
  console.log("running autofill...");
  const char = cloneDeep(initChar);

  for (const change of changes) {
    console.log("checking:");
    console.log(change);

    //score update logic, propagates to mods and stand stats
    if (change.field.includes("-score")) {
      updateScore(char, change.field.replace("-score", ""), (change.newState as number | undefined ?? 0) - (change.prevState as number | undefined ?? 0));
      if (char.data.class == "act")
        selectAct(char, parseInt(char.data.selectedAct))
    }

    //mod update logic, propagates to skills
    if (/^...-mod$/.test(change.field)) {
      const stat = change.field.replace("-mod", "");
      updateSkills(char, stat);
      updateSave(char, stat);
      updateMiscfields(char, stat);
    }

    //stand mod update logic, propagates to misc fields
    if (/^S...-mod$/.test(change.field)) {
      const stat = change.field.replace("-mod", "");
      updateMiscfields(char, stat);
    }

    //save mult update logic, propagates to saves
    if (/^...-save$/.test(change.field)) {
      const stat = change.field.replace("-save", "");
      updateSave(char, stat);
    }

    //save mult update logic, propagates to saves
    if (["acro", "ath", "dec", "ani", "pers", "sli", "grit", "intim", "invest", "his", "medi", "perc", "perf", "sci", "steal", "arc", "surv", "ins"].includes(change.field)) {
      const skillStatMap = {acro: "dex", ath: "str|wis", dec: "cha", ani: "wis|cha", pers: "cha", sli: "dex", grit: "con", intim: "str|cha", invest: "int", his: "int", medi: "int|wis", perc: "wis", perf: "cha", sci: "int", steal: "dex", arc: "int|wis", surv: "int|wis", ins: "wis|cha"};
      const stats = skillStatMap[change.field as keyof typeof skillStatMap].split("|");
      const mod1 = parseInt((char.data[`${stats[0]}-mod` as DataField] as string | undefined )|| "0");
      const mod2 = stats.length > 1 ? parseInt((char.data[`${stats[1]}-mod` as DataField] as string | undefined )|| "0") : undefined;
      switch (change.field) {
        case "intim":
        case "medi":
        case "surv":
          updateSkill(char, (`${change.field}-bonus0`) as DataField, mod1);
          updateSkill(char, (`${change.field}-bonus`) as DataField, mod2!);
          break;
        case "ath":
        case "ani":
        case "arc":
        case "ins":
          updateSkill(char, (`${change.field}-bonus`) as DataField, mod1);
          updateSkill(char, (`${change.field}-bonus2`) as DataField, mod2!);
          break;
        default:
          updateSkill(char, (`${change.field}-bonus`) as DataField, mod1);
      }
    }
    
    //update respective acts when main stand stat is changed
    if (/^S...-(mod|score)$/.test(change.field) && char.data.class == "act") {
      const parts = change.field.split("-");
      const stat = parts[0].replace("S", "");
      const type = parts[1];
      const key = `act${char.data.selectedAct}-${stat}-${type}` as DataField;
      updateDataField(char, key, parseInt(char.data[key] as string) + (change.newState as number | undefined ?? 0) - (change.prevState as number | undefined ?? 0));
      if (type == "score")
        updateMod(char, stat, parseInt(char.data.selectedAct));
    }

    //simpler single-field changes
    switch (change.field) {
      case "level":
        updateProfBonus(char, change.newState as number);
        updateHitDice(char, change.newState as number, char.data.class);
        break;
      case "class":
        updateHitDice(char, parseInt(char.data.level ?? "0"), change.newState as string);
        break;
      case "selectedAct":
        if (char.data.class == "act")
          selectAct(char, change.newState as number);
        break;
      case "act4Base":
        const prefix = `act${(change.newState as string).replace("act", "")}-`;
        ["str", "dex", "con", "int", "wis", "cha"].forEach(stat => {
          updateDataField(char, `act4-${stat}-score` as DataField, parseInt(char.data[`${prefix}${stat}-score` as DataField] as string | undefined ?? "0") * 2);
          updateMod(char, `${stat}`, 4);
        });
        break;
      case "bonus":
        updateAllSaves(char);
        updateAllSkills(char);
        updateSDC(char);
        break;
      case "classFeats":
      case "otherFeats":
        const prev = (change.prevState as string).toLowerCase();
        const next = (change.newState as string).toLowerCase();
        if (prev.includes("jack of all trades") || next.includes("jack of all trades")) {
          updateAllSaves(char);
          updateAllSkills(char);
        }
        if (prev.includes("trained combatant") || next.includes("trained combatant"))
          updateAttacks(char);
        if (prev.includes("calculating") || next.includes("calculating"))
          updateSDC(char);
        break;
      case "pspeed":
        updateSpeeds(char);
        break;
      case "perc-bonus":
        updateDataField(char, "percep", 10 + parseInt((change.newState ?? "0") as string));
        break;
    }
  }
  return char;  
}

//update any field on the data to a new value
function updateDataField(char: Character, field: DataField, value: unknown) {
  console.log("setting " + field + " to: " + value);
  char.data = {
    ...char.data,
    [field]: value
  }
}

//switch which act is selected, or update the main stats with changed act stats
function selectAct(char: Character, act: number) {
    const prefix = `act${act}-`;
    ["str", "dex", "con", "int", "wis", "cha"].forEach(stat => {
      updateDataField(char, `S${stat}-score` as DataField, char.data[`${prefix}${stat}-score` as DataField]);
      updateDataField(char, `S${stat}-mod` as DataField, char.data[`${prefix}${stat}-mod` as DataField]);
    });
}

//determine where score updates need to propagate
function updateScore(char: Character, stat: string, diff: number) {
  if (!/^(act\d-)?S.*/.test(stat) && diff != 0) { //non-stand score changed
    if (char.data.class == "act")
      updateActScores(char, `${stat}`, diff);
    else
      updateStandScore(char, `S${stat}`, diff);
  }
  updateMod(char, stat);
}

//propagate score changes to stand using mults
function updateStandScore(char: Character, stat: string, diff: number) {
  const characterClasses: Record<string, string> = {pow: "Power-Type", rng: "Ranged-Type", rmt: "Remote-Type", abl: "Ability-Type", enh: "Enhancement-Type", rev: "Revenge-Type", ind: "Independent-Type", hive: "Hive-Type", act: "Act-Type", rip: "Ripple", spin: "Spin", art: "Artisan", ass: "Assassin", con: "Consul", heav: "Heavyweight", ran: "Ranger", sch: "Scholar", war: "Warrior", multi: "Other/Multiple"};
  const mults = (getClassData(characterClasses[char.data.class]))?.mults;
  const statIndex = ["Sstr", "Sdex", "Scon", "Sint", "Swis", "Scha"].indexOf(stat);
  if (!mults)
    return;
  const currentScore = parseInt(char.data[`${stat}-score` as DataField] as string) ?? 0;
  updateDataField(char, `${stat}-score` as DataField, currentScore + diff * mults[statIndex]);
  updateMod(char, stat);
}

//propagate score changes to all act mods using mults
function updateActScores(char: Character, stat: string, diff: number, act?: number) {
  if (!/^...$/.test(stat))
    return;
  const typesContent = getClassData("Act-Type")!.other![0]!.content[1]; //TODO: getting this out of text content is gross but better than having it in two separate places, consider moving this list elsewhere
  const multMatches = [...typesContent.matchAll(/(?<=x)\d+/gm)].map(m => m[0]);
  console.log(multMatches);
  [1,2,3,4].forEach(i => {
    if (!act || i == act) {
      const base = i == 4 ? parseInt(char.data.act4Base?.replace("act", "")) ?? "3" : i;
      const defaultTypes = ["long", "ability", "close", "close"];
      const type = char.data[`act${base}Type` as DataField] ?? defaultTypes[i - 1];
      const currentScore = parseInt(char.data[`act${i}-${stat}-score` as DataField] as string | undefined ?? "0");
      const act4Mult = i == 4 ? 2 : 1;
      const statIndex = ["str", "dex", "con", "int", "wis", "cha"].indexOf(stat);
      switch (type) {
        case "close":
          updateDataField(char, `act${i}-${stat}-score` as DataField, currentScore + diff * parseInt(multMatches.slice(0, 6)[statIndex]) * act4Mult);
          break;
        case "long":
          updateDataField(char, `act${i}-${stat}-score` as DataField, currentScore + diff * parseInt(multMatches.slice(6, 12)[statIndex]) * act4Mult);
          break;
        case "ability":
          updateDataField(char, `act${i}-${stat}-score` as DataField, currentScore + diff * parseInt(multMatches.slice(18, 24)[statIndex]) * act4Mult);
          break;
        case "remote":
          updateDataField(char, `act${i}-${stat}-score` as DataField, currentScore + diff * parseInt(multMatches.slice(12, 18)[statIndex]) * act4Mult);
          break;
        default:
          break;
      }
      updateMod(char, stat, i);
    }
  });
}

//update any mod based on the score value
function updateMod(char: Character, stat: string, act?: number) {
  const actPrefix = act ? `act${act}-` : "";
  const score = parseInt(char.data[`${actPrefix}${stat}-score` as DataField] as string | undefined ?? "0");
  const mod = isNaN(score) || score == 0 ? "" : act || stat.includes("act") || /^S.*/.test(stat) ? Math.floor(score / 10) : Math.floor((score - 10) / 2);
  const modSign = !mod || mod <= 0 ? "" : "+";
  updateDataField(char, `${actPrefix}${stat}-mod` as DataField, `${modSign}${mod}`);
  updateSkills(char, stat);
  updateSave(char, stat);
  updateMiscfields(char, stat);
}

//update the proficiency bonus and propagate to skills
function updateProfBonus(char: Character, level: number) {
  if (isNaN(level))
    return;
  let bonus = Math.floor((level - 1) / 4) + 2;
  if (bonus > 6)
      bonus = 6;
  if (bonus < 2)
      bonus = 2;
  updateDataField(char, "bonus", bonus);
  updateAllSkills(char);
  updateAllSaves(char);
  updateSDC(char);
}

//update ALL skills based on stat mods
function updateAllSkills(char: Character) {
  ["str", "dex", "con", "int", "wis", "cha"].forEach(stat => updateSkills(char, stat));
}

//update skills based on a specific stat mod
function updateSkills(char: Character, stat: string) {
  const mod = parseInt(char.data[`${stat}-mod` as DataField] as string | undefined ?? "0");
  switch (stat) {
    case "str": 
      ["ath", "intim"].forEach(skill => {
        const suffix = skill == "intim" ? "0" : "";
        updateSkill(char, `${skill}-bonus${suffix}` as DataField, mod);
      });
      break;
    case "dex":
      ["acro", "sli", "steal"].forEach(skill => {
        updateSkill(char, `${skill}-bonus` as DataField, mod);
      });
      break;
    case "con":
      ["grit"].forEach(skill => {
        updateSkill(char, `${skill}-bonus` as DataField, mod);
      });
      break;
    case "int":
      ["invest", "his", "medi", "sci", "arc", "surv"].forEach(skill => {
        const suffix = ["medi", "surv", "arc"].includes(skill) ? "0" : "";
        updateSkill(char, `${skill}-bonus${suffix}` as DataField, mod);
      });
      break;
    case "wis":
      ["ath", "ani", "medi", "perc", "arc", "surv", "ins"].forEach(skill => {
        const suffix = ["ath", "arc"].includes(skill) ? "2" : "";
        updateSkill(char, `${skill}-bonus${suffix}` as DataField, mod);
      });
      break;
    case "cha":
      ["dec", "ani", "pers", "intim", "perf", "ins"].forEach(skill => {
        const suffix = ["ani", "ins"].includes(skill) ? "2" : "";
        updateSkill(char, `${skill}-bonus${suffix}` as DataField, mod);
      });
      break;
    default: return;
  }
}

//update one skill based on a mod or PB mult change
function updateSkill(char: Character, field: DataField, mod: number) {
  const multString = char.data[field.replace(/-.*$/, "") as DataField] as string | undefined;
  const mult = parseInt(convertMult(multString)?.replace(/^x?/, "") || "0");
  const jackCount = countFeat(char, "jack of all trades");
  const jackBonus = Math.floor(parseInt(char.data.bonus) / 2);
  const bonus = mult > 0 ? parseInt(char.data.bonus) * mult + (jackCount > 1 ? jackBonus : 0) : jackCount > 0 ? jackBonus : 0;
  updateDataField(char, field, mod + bonus);
  
  if (field == "perc-bonus")
    updateDataField(char, "percep", 10 + mod + bonus);
}

//update ALL saves based on stat mods
function updateAllSaves(char: Character) {
  ["str", "dex", "con", "int", "wis", "cha"].forEach(stat => updateSave(char, stat));
}

//update saves based on a specific stat mod
function updateSave(char: Character, stat: string) {
  const mod = parseInt((char.data[`${stat}-mod` as DataField] as string | undefined) ?? "0");
  const multString = char.data[`${stat}-save` as DataField] as string | undefined;
  const mult = parseInt(convertMult(multString)?.replace(/^x?/, "") ?? "0");
  const jackCount = countFeat(char, "jack of all trades");
  const jackBonus = Math.floor(parseInt(char.data.bonus) / 2);
  const bonus = mult > 0 ? parseInt(char.data.bonus) * mult + (jackCount > 1 ? jackBonus : 0) : jackCount > 0 ? jackBonus : 0;
  updateDataField(char, `${stat}-bonus` as DataField, mod + bonus);
}

//converst old skill/save mult format to the new one
function convertMult(mult?: string) {
  switch (mult) {
    case "on":
    case "p":
      return "x1";
    case "e":
      return "x2";
    case "m":
      return "x3";
    default:
      return mult;
  }
}

//update hit dice based on level and class
function updateHitDice(char: Character, level: number, cls: string) {
  const classMap = {pow: 12, rng: 8, rmt: 10, abl: 6, enh: 10, rev: 10, ind: 10, hive: 8, act: 8, rip: 10, spin: 8, art: 6, ass: 8, con: 8, heav: 12, ran: 8, sch: 6, war: 10, multi: NaN};
  const die = classMap[cls as keyof typeof classMap];
  if (isNaN(die))
    return;
  updateDataField(char, "hdice", `${level}d${die}`);
}

//update stand movement based on stand or user speed, and set user speed to 10 if blank
function updateSpeeds(char: Character) {
  if (char.data.class == "ind") {
    updateDataField(char, "sspeed", 10);
    return;
  }

  const user = parseInt(char.data.pspeed ?? "0");
  const speed = parseInt(char.data["Sint-mod"] ?? "0");

  if(isNaN(user) || user == 0) {
    updateDataField(char, "pspeed", 10);
    updateDataField(char, "sspeed", Math.max(10, speed * 2));
  }
  else
    updateDataField(char, "sspeed", Math.max(user, speed * 2));
}

//updates the number of attacks based on stand speed and feats
function updateAttacks(char: Character) {
  const speed = parseInt(char.data["Swis-score"] ?? "0");
  const trainedCount = countFeat(char, "trained combatant");
  updateDataField(char, "atks", 1 + Math.floor(speed / 50) + trainedCount);
}

//update ac based on stats
function updateAC(char: Character) {
  const dex = parseInt(char.data["dex-mod"] ?? "0");
  const con = parseInt(char.data["con-mod"] ?? "0");
  const wis = parseInt(char.data["wis-mod"] ?? "0");
  updateDataField(char, "ac", 10 + dex + con + wis - Math.min(dex, con, wis));
}

//update stand ac based on stand stats
function updateSAC(char: Character) {
  const pre = parseInt(char.data["Sdex-mod"] ?? "0");
  const dur = parseInt(char.data["Scon-mod"] ?? "0");
  const spd = parseInt(char.data["Swis-mod"] ?? "0");
  updateDataField(char, "sac", 10 + pre + dur + spd);
}

//update stand dc based on stats and feats
function updateSDC(char: Character) {
  const prof = parseInt(char.data.bonus ?? "0");
  const int = parseInt(char.data["int-mod"] ?? "0");
  const wis = parseInt(char.data["wis-mod"] ?? "0");
  const cha = parseInt(char.data["cha-mod"] ?? "0");
  const calc = countFeat(char, "calculating") > 0 ? 2 : 0;
  const stat = calc > 0 ? Math.max(int, wis, cha) : cha;
  console.log(calc);
  console.log(stat);
  console.log(Math.max(int, wis, cha))
  updateDataField(char, "dc", 8 + prof + stat + calc);
}

//update other fields based on a specific stat mod
function updateMiscfields(char: Character, stat: string) {
  switch (stat) {
    case "str": 
      break;
    case "dex":
      updateAC(char);
      updateDataField(char, "init", `+${parseInt(char.data["dex-mod"] ?? "0") + parseInt(char.data["wis-mod"] ?? "0")}`.replace("+-", "-"));
      break;
    case "con":
      updateAC(char);
      break;
    case "int":
      updateSDC(char);
      break;
    case "wis":
      updateAC(char);
      updateDataField(char, "init", `+${parseInt(char.data["dex-mod"] ?? "0") + parseInt(char.data["wis-mod"] ?? "0")}`.replace("+-", "-"));
      updateSDC(char);
      break;
    case "cha":
      updateSDC(char);
      break;
    case "Sstr":
      break;
    case "Sdex":
      updateSAC(char);
      break;
    case "Scon":
      updateSAC(char);
      updateDataField(char, "reduction", char.data["Scon-mod"]?.replace("+", ""));
      break;
    case "Sint":
      updateSpeeds(char);
      break;
    case "Swis":
      updateSAC(char);
      updateAttacks(char);
      break;
    case "Scha":
      break;
  }
}

//TODO: Look through more feats to consider for autofill
//count the occurences of a specific feat
function countFeat(char: Character, feat: string) {
  const feats = (char.data.otherFeats?.toLowerCase() ?? "") + (char.data.classFeats?.toLowerCase() ?? "");
  const count1 = feats.matchAll(new RegExp(feat, "g")).toArray().length;
  const count2 = parseInt(feats.match(new RegExp(`(?<=${feat} x|${feat}x|${feat.replaceAll(/\s/g, "")}x)\\d+`))?.toString() ?? "0");
  return Math.max(count1, count2);
}