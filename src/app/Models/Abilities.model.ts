export interface AbilityData {
  name: string;
  classes: string[];
  desc: string[];
  subAbilities?: AbilityData[];
  isSub?: boolean;
  expanded?: boolean;
  tags?: string[];
}