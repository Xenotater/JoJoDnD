"use server";

import { doGetFetchWithCache } from "@/app/Utilities/fetch.utility";

export async function doGetDiscordDetails() {
  const endpoint = "https://discordapp.com/api/v7/invite/nmgSjPW8xs?with_counts=true";
  const response = await doGetFetchWithCache(endpoint);
  if (response.status == 200)
    return await response.body as DiscordDetails;
  return null;
}

export async function doGetRedditDetails() {
  const endpoint = "https://www.reddit.com/r/jojodnd/about.json";
  const response = await doGetFetchWithCache(endpoint);
  if (response.status == 200)
    return response.body as RedditDetails;
  return null;
}

export interface DiscordDetails {
  approximate_member_count: number;
  approximate_presence_count: number;
  guild: {
    name: string;
    id: string;
    icon: string;
  };
}

export interface RedditDetails {
  data: {
    subscribers: number;
    active_user_count: number;
    display_name_prefixed: string;
    community_icon: string;
  }
}