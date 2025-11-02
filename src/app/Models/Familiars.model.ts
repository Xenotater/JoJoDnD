export interface FamiliarData {
  info: FamiliarInfo;
  classes: FamiliarClass[];
  features: FamiliarFeature[];
  feats: FamiliarFeat[];
}

export type FamiliarItemData = FamiliarInfo | FamiliarClass | FamiliarFeature | FamiliarFeat;

export interface FamiliarInfo {
  name: string;
  img: string;
  desc: string;
  content: {
    name: string;
    content: string[];
  }[];
}

export interface FamiliarClass {
  name: string;
  img: string;
  desc: string;
  profs: string;
  profNum: number;
  adProfs: number;
  prime: string;
  levels: {
    pro: number;
    feats: number;
    dice: number;
    features?: string[];
  }[];
}

export interface FamiliarFeature {
  name: string;
  desc: string[];
  classes: string[];
}

export interface FamiliarFeat {
  name: string;
  desc: string[];
}