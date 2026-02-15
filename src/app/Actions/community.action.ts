"use server";

import { getServerSession } from "next-auth";
import { CommunityResource, ResourceSort } from "../Models/Resources.model";
import { doDBQuery } from "../Utilities/mysql.utility";

const resourcesPerPage = 12; //TODO: re-evaluate

export async function doGetResourcesPerPage() {
  return resourcesPerPage;
}

export async function doGetResources(page: number = 1, sort: ResourceSort = "Top", search = "") {
  const sortMap = {"A-Z" : "name ASC", "Top": "upvotes DESC", "New": "id DESC"}
  const resp = await doDBQuery(`SELECT id, name, description, link, variants, upvotes FROM resources WHERE status='approved' AND name LIKE ? ORDER BY ${sortMap[sort]} LIMIT ? OFFSET ?`,
    [`%${search}%`, resourcesPerPage.toString(), ((page - 1) * resourcesPerPage).toString()], false);
  if (resp.status == 200) {
    return (await resp.json()) as CommunityResource[];
  }
  return null;
}

export async function doCountResourcePages(search = "", status = "approved") {
  const resp = await doDBQuery(`SELECT COUNT(id) AS 'count' FROM resources  WHERE status LIKE ? AND name LIKE ?`, [`%${status}%`, `%${search}%`], false);
  if (resp.status == 200) {
    return Math.ceil((await resp.json())[0].count as number / resourcesPerPage);
  }
  return null;
}

export async function doSubmitNewResource(data: CommunityResource) {
  const session = await getServerSession();
  if (!session?.user?.name)
    return 401;
  const resp = await doDBQuery("INSERT INTO resources (username, name, description, link, variants, contact) VALUES (?, ?, ?, ?, ?, ?)",
    [session.user.name, data.name, data.description, data.link, data.variants ? data.variants : null, data.contact ? data.contact : null]);
  return resp.status;
}

export async function doUpdateResource(newData: CommunityResource) {
  const session = await getServerSession();
  if (!session?.user?.name)
    return 401;
  const currentData = await getResource(newData.name);
  if (currentData && currentData.username == session.user.name) {
    //TODO: implement update
  }
}

async function getResource(name: string) {
  const resp = await doDBQuery(`SELECT * FROM resources WHERE name = ? LIMIT 1`, [name], false);
  if (resp.status == 200)
    return (await resp.json()) as CommunityResource;
  return undefined;
}