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
    content?: string[];
  }[];
  other?: {
    name: string;
    content: string[];
  }[];
  theme?: string;
  levels?: ClassLevelData[];
  otherCols?: {
    name: string;
    level: string[] | number[];
  }[];
  subTypes?: ClassData[];
  variants?: ClassData[];
}

export interface ClassLevelData {
  abilities?: string[];
  feats?: string[];
  other?: string[];
}