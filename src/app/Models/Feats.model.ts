export interface FeatData {
  name: string;
  desc?: string;
  effects: string[];
  prereq?: string;
  subFeats?: string[];
  isSub?: boolean;
  expanded?: boolean;
  tags?: string[];
}