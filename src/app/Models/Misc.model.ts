export interface ContentTags {
  category: string;
  tags: string[];
}

//TODO: replace more hard-coded tables with this structure
export interface TableData {
  class?: string;
  head?: string[];
  body: string[][];
}