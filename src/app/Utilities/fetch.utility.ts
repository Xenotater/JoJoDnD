"use server";

import { CacheLife, cacheLife } from "next/dist/server/use-cache/cache-life";
import { logRequest, logResponse } from "./logging.utility";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { HTTP_METHOD } from "next/dist/server/web/http";

export async function doGetFetch(endpoint: string, body: string = ""): Promise<FetchResponse> {
  logRequest(endpoint, "GET", body);
  const response = await fetch(endpoint + body, {
    method: "GET",
    cache: "no-cache",
  });
  logResponse(response);
  return {body: await response.json(), status: response.status};
}

export async function doGetFetchWithCache(endpoint: string, body: string = "", cacheOptions: FetchCacheOptions = defaultCacheOptions): Promise<FetchResponse> {
  "use cache";
  if (cacheOptions && cacheOptions.life)
    cacheLife(cacheOptions.life);
  if (cacheOptions && cacheOptions.tags)
    cacheTag(...cacheOptions.tags);
  const response = await doGetFetch(endpoint, body);
  return response;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function doFetch(endpoint: string, method: HTTP_METHOD, body: any): Promise<FetchResponse> {
  logRequest(endpoint, method, body);
  const response = await fetch(endpoint, {
    method: method,
    body: JSON.stringify(body)
  });
  logResponse(response);
  return {body: await response.json(), status: response.status};
}

export interface FetchResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  status: number;
}

export interface FetchCacheOptions {
  life?: 'default' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'max' | CacheLife;
  tags?: string[];
}

const defaultCacheOptions: FetchCacheOptions = {
  life: "minutes"
}