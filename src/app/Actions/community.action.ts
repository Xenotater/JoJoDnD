"use server";

import { CommunityResource } from "../Models/Resources.model";
import { doDBQuery } from "../Utilities/mysql.utility";

const resourcesPerPage = 9; //evaluate

export async function doGetResourcesPerPage() {
  return resourcesPerPage;
}

export async function doGetResources(page: number = 1, sort: "A-Z" | "Top" | "New" = "Top", search?: string) {
  const sortMap = {"A-Z" : "name ASC", "Top": "upvotes DESC", "New": "id DESC"}
  const resp = await doDBQuery(`SELECT * FROM resources ORDER BY ${sortMap[sort]} LIMIT ${resourcesPerPage} OFFSET ${(page - 1) * resourcesPerPage} ${search ? `WHERE name LIKE '%search%'` : ""}`, false);
  if (resp.status == 200) {
    return (await resp.json()) as CommunityResource[];
  }
  return null;
}

export async function doCountResources(search?: string) {
  const resp = await doDBQuery(`SELECT COUNT(id) AS 'count' FROM resources ${search ? `WHERE name LIKE '%search%'` : ""}`, false);
  if (resp.status == 200) {
    return (await resp.json())[0].count as number;
  }
  return null;
}