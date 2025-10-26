import {tabs} from "@/../public/data/rules.json";
import {passions} from "@/../public/data/passions.json";
import {races} from "@/../public/data/races.json";
import {abilities} from "@/../public/data/abilities.json";
import {weapons} from "@/../public/data/weapons.json";
import {feats} from "@/../public/data/feats.json";
import { PassionData } from "../Models/Passions.model";
import { RaceData } from "../Models/Races.model";
import { AbilityData } from "../Models/Abilities.model";
import { FeatData } from "../Models/Feats.model";
import { WeaponData } from "../Models/Weapons.model";

export type dataTypes = "Rules"
  | "Passions"
  | "Races"
  | "Abilities"
  | "Feats";

const getData = (type: dataTypes): unknown[] => {
  switch(type) {
    case "Rules":
      return tabs;
    case "Passions":
      return passions;
    case "Races":
      return races;
    case "Abilities":
      return abilities;
    case "Feats":
      return feats;
    default:
      return [undefined];
  }
}

export function getRulesContent() {
  return tabs;
}

export function getRuleContent(tabName: string) {
  return tabs.find((t) => t.title.toLowerCase() == tabName.toLowerCase())
}

export function getFirstItem(type: dataTypes, sortBy?: string) {
  let data = getData(type);

  if (sortBy)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data = data.sort((a: any, b: any) => a[sortBy as keyof typeof a] > b[sortBy as keyof typeof b] ? 1 : -1);
    } catch {} //don't error if sorting fails

  return data[0];
}

export function getPassionData(passion: string) {
  return passions.find((p) => p.name.toLowerCase() == passion.toLowerCase()) as PassionData;
}

export function getRaceData(race: string) {
  return races.find((r) => r.name.toLowerCase() == race.toLowerCase()) as RaceData;
}

export function getAbilityData(ability: string) {
  return abilities.find((a) => a.name.toLowerCase() == ability.toLowerCase()) as AbilityData;
}

export function getFeatData(feat: string) {
  return feats.find((f) => f.name.toLowerCase() == feat.toLowerCase()) as FeatData;
}

export function getWeaponData(weapon: string) {
  return weapons.find((w) => w.name.toLowerCase() == weapon.toLowerCase()) as WeaponData;
}