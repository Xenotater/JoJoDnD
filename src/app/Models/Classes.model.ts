import { TableData } from "./Misc.model";

export interface ClassData {
  name: string;
  nameExt?: string;
  aka?: string;
  desc: string;
  exampleOf?: string;
  examples?: string[];
  links?: string[];
  hDice?: string;
  dcName?: string;
  dc?: string;
  aDice?: string[];
  levelUp?: string;
  mults?: number[];
  notes?: string[];
  extra?: {
    name: string;
    desc: string;
    table?: TableData;
  }[];
  other?: {
    name: string;
    content: string[];
  }[];
  theme?: string;
  levelTables: ClassLevelTable[];
  otherCols: {
    name: string;
    level: string[] | number[];
  }
  subTypes?: ClassData[];
}

export interface ClassLevelTable {
  name: string;
  levels: ClassLevelData[];
}

export interface ClassLevelData {
  abilities: string[];
  feats: string[];
  stats: string[];
  other: string[];
}