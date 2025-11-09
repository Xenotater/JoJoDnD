export interface ArtifactData {
  name: string;
  desc: string;
  effect?: string;
  lore?: string;
  note?: string;
  other?: OtherContent[];
}

interface OtherContent {
  name: string;
  content: string[];
  anchor?: string;
}