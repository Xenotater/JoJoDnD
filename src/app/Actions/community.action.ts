"use server";

import { CommunityResource, ResourceSort } from "../Models/Resources.model";
import { doDBQuery } from "../Utilities/mysql.utility";

const resourcesPerPage = 12; //TODO: re-evaluate

export async function doGetResourcesPerPage() {
  return resourcesPerPage;
}

export async function doGetResources(page: number = 1, sort: ResourceSort = "Top", search?: string) {
  const sortMap = {"A-Z" : "name ASC", "Top": "upvotes DESC", "New": "id DESC"}
  const resp = await doDBQuery(`SELECT id, name, description, link, variants, upvotes FROM resources WHERE status='approved' ${search ? `AND name LIKE '%${search}%'` : ""} ORDER BY ${sortMap[sort]} LIMIT ${resourcesPerPage} OFFSET ${(page - 1) * resourcesPerPage}`, false);
  if (resp.status == 200) {
    return (await resp.json()) as CommunityResource[];
  }
  return null;
}

export async function doCountResourcePages(search?: string, status = "approved") {
  const resp = await doDBQuery(`SELECT COUNT(id) AS 'count' FROM resources  WHERE status LIKE '%${status}%' ${search ? `AND name LIKE '%${search}%'` : ""}`, false);
  if (resp.status == 200) {
    return Math.ceil((await resp.json())[0].count as number / resourcesPerPage);
  }
  return null;
}