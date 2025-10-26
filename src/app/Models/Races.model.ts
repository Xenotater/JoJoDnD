export interface RaceData {
  name: string;
  desc: string;
  isPlayerRace: boolean;
  playing?: string;
  examples?: string[];
  links?: string[];
  changes?: string;
  feats?: string[];
  theme?: string;
  levels?: RaceLevel[];
  note?: string;
  note2?: string;
  subraces?: SubRace[];
}

interface RaceLevel {
  energy: number;
  feats?: string[];
  special?: string[];
}

interface SubRace {
  name: string;
  desc: string;
  feats?: string[];
}