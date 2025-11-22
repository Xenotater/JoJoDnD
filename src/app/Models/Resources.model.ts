export interface CommunityResource {
  name: string;
  description: string;
  link: string;
  multiple: boolean;
  upvotes: number;
  status: string;
  modified: Date;
}

export type ResourceSort = "A-Z" | "Top" | "New";