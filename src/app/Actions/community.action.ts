"use server";

import { getServerSession } from "next-auth";
import { CommunityResource, ResourceSort } from "../Models/Resources.model";
import { doDBQuery } from "../Utilities/mysql.utility";

const resourcesPerPage = 12; //TODO: re-evaluate

export async function doGetResourcesPerPage() {
  return resourcesPerPage;
}

export async function doGetResources(page: number = 1, sort: ResourceSort = "Top", search = "", user = "") {
  const sortMap = {"A-Z" : "name ASC", "Top": "upvotes DESC", "New": "id DESC"}
  const resp = await doDBQuery(`SELECT id, name, description, link, variants, upvotes, status, username FROM resources WHERE status LIKE ? AND username LIKE ? AND name LIKE ? ORDER BY ${sortMap[sort]} LIMIT ? OFFSET ?`,
    [user ? "%" : "approved", `%${user}%`, `%${search}%`, resourcesPerPage.toString(), ((page - 1) * resourcesPerPage).toString()], false);
  if (resp.status == 200) {
    return (await resp.json()) as CommunityResource[];
  }
  return null;
}

export async function doCountResourcePages(search = "", user = "") {
  const resp = await doDBQuery(`SELECT COUNT(id) AS 'count' FROM resources  WHERE username LIKE ? AND status LIKE ? AND name LIKE ?`, [`%${user}%`, user ? "%" : "approved", `%${search}%`], false);
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

export async function doUpdateResource(id: number, newData: CommunityResource) {
  const session = await getServerSession();
  if (!session?.user?.name)
    return 401;
  const currentData = await getResource(newData.name);
  if (currentData && currentData.username == session.user.name) {
    //TODO: implement update
    //Leave original intact for now, create new entry with "clones" column using original id
    //After approval, replace original content with updated content and delete the clone
    //Only allow one clone of a resource. If one already exists (ie, the original has a "clones" column), update the clone.
  }
}

export async function doUpdateResourceStatus(id: number, status: string) {
  const session = await getServerSession();
  if (!session?.user?.name)
    return 401;
  const resp = await doDBQuery("UPDATE resources SET status = ? WHERE id = ?", [status, `${id}`]);
  return resp.status;
}

async function getResource(name: string) {
  const resp = await doDBQuery(`SELECT * FROM resources WHERE name = ? LIMIT 1`, [name], false);
  if (resp.status == 200)
    return (await resp.json()) as CommunityResource;
  return undefined;
}