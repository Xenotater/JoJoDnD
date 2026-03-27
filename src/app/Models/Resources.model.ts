export interface CommunityResource {
  id: number;
  name: string;
  description: string;
  link: string;
  variants?: string;
  meta?: string;
  upvotes?: number;
  status?: string;
  contact?: string;
  username?: string;
  modified_ts?: Date;
  insert_ts?: Date;
  clones: number;
}

export type ResourceSort = "A-Z" | "Top" | "New";