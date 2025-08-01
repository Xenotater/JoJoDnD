export interface PassionData {
  name: string;
  stats: string;
  desc: string;
  examples: string[];
  saves: string;
  ability?: string;
  custom: {name: string, desc: string};
  alt: string;
  tags?: string[];
}