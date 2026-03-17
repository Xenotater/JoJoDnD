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
  modified?: Date;
  username?: string;
}

export type ResourceSort = "A-Z" | "Top" | "New";