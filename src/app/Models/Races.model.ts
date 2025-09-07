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
  levels?: {
    energy: number;
    feats?: string[];
    special?: string[];
  }[];
  note?: string;
  note2?: string;
  subraces?: {
    name: string;
    desc: string;
    feats?: string[];
  }[];
}