export interface CommunityResource {
  name: string;
  description: string;
  link: string;
  variants: string;
  upvotes?: number;
  status?: string;
  contact?: string;
  modified?: Date;
  username?: string;
}

export type ResourceSort = "A-Z" | "Top" | "New";