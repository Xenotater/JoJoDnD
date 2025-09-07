import {tabs} from "@/../public/data/rules.json";
import {passions, tags as passionTags} from "@/../public/data/passions.json";
import {races} from "@/../public/data/races.json";
import { ContentTags } from "../Models/Misc.model";

export type dataTypes = "Rules"
  | "Passions"
  | "Races";

const getData = (type: dataTypes): unknown[] => {
  switch(type) {
    case "Rules":
      return tabs;
    case "Passions":
      return passions;
    case "Races":
      return races;
    default:
      return [undefined];
  }
}

export const getTags = (type: dataTypes): ContentTags[] => {
  switch(type) {
    case "Passions":
      return passionTags;
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

export function getFirstItem(type: dataTypes) {
  return getData(type)[0];
}

export function getPassionData(passion: string) {
  return passions.find((p) => p.name.toLowerCase() == passion.toLowerCase());
}

export function getRaceData(race: string) {
  return races.find((r) => r.name.toLowerCase() == race.toLowerCase());
}