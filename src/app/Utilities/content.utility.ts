import {tabs} from "@/../public/data/rules.json";
import {passions} from "@/../public/data/passions.json";
import {races} from "@/../public/data/races.json";
import {classes} from "@/../public/data/classes.json";
import {categories} from "@/../public/data/familiars.json";
import {abilities} from "@/../public/data/abilities.json";
import {feats} from "@/../public/data/feats.json";
import {weapons} from "@/../public/data/weapons.json";
import {artifacts} from "@/../public/data/artifacts.json";
import { RulesTabData } from "../Models/Rules.model";
import { PassionData } from "../Models/Passions.model";
import { RaceData } from "../Models/Races.model";
import { ClassData } from "../Models/Classes.model";
import { AbilityData } from "../Models/Abilities.model";
import { FeatData } from "../Models/Feats.model";
import { WeaponData } from "../Models/Weapons.model";
import { ArtifactData } from "../Models/Artifacts.model";
import { FamiliarClass, FamiliarFeat, FamiliarFeature, FamiliarInfo } from "../Models/Familiars.model";

export type dataTypes = "Rules"
  | "Passions"
  | "Races"
  | "Classes"
  | "Abilities"
  | "Feats"
  | "Artifacts";

const getData = (type: dataTypes): unknown[] => {
  switch(type) {
    case "Rules":
      return tabs as RulesTabData[];
    case "Passions":
      return passions as PassionData[];
    case "Races":
      return races as RaceData[];
    case "Classes":
      return classes as ClassData[];
    case "Abilities":
      return abilities as AbilityData[];
    case "Feats":
      return feats as FeatData[];
    case "Artifacts":
      return artifacts as ArtifactData[];
    default:
      return [];
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

export function getClassData(cls: string) {
  const data = classes.find((c) => c.name.toLowerCase() == cls.toLowerCase()) as ClassData;
  if (data)
    return data;

  for (const c of classes) {
    const data = c.subTypes?.find((s) => s.name.toLowerCase() == cls.toLowerCase())
    if (data)
      return data as ClassData;
  };
  return undefined;
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

export function getArtifactData(artifact: string) {
  return artifacts.find((a) => a.name.toLowerCase() == artifact.toLowerCase()) as ArtifactData;
}

export function getFamiliarData(item: string) {
  if (!item || item == "Familiars")
    return categories.info as FamiliarInfo;
  return categories.classes.find((c) => c.name.toLowerCase() == item.toLowerCase()) as FamiliarClass
  ?? categories.features.find((f) => f.name.toLowerCase() == item.toLowerCase()) as FamiliarFeature
  ?? categories.feats.find((f) => f.name.toLowerCase() == item.toLowerCase()) as FamiliarFeat;
}