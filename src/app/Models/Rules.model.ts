export interface RulesTabData {
  title: string;
  sections: {
    heading: string;
    items: {
      subheading: string;
      details: string[];
      compactDetails?: string[];
      other?: string[];
    }[]
  }[]
}