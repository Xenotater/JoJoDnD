"use server";

//import { log } from "@/app/Utilities/logging.utility";
import { doDBQuery } from "@/app/Utilities/mysql.utility";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

export interface patron {
  id: number;
  name: string;
  date: string;
}

//maybe get this from a Patreon API at some point, for now just check the DB
export async function doGetPatrons() {
  "use cache";
  cacheLife("days");
  const response = await doDBQuery("SELECT * FROM patrons", false);
  if (response.status != 200)
    return [];
  //log("Patron Response: " + await response.clone().text());
  return await response.json() as patron[];
};