"use server";

import { getServerSession } from "next-auth";
import { CommunityResource, ResourceSort } from "../Models/Resources.model";
import { doDBQuery } from "../Utilities/mysql.utility";
import { clearFilesInFolder, delS3File, getBucketURL, getS3File, listFilesInFolder, postS3File } from "../Utilities/aws.utility";

const resourcesPerPage = 12; //TODO: re-evaluate

export async function doGetResourcesPerPage() {
  return resourcesPerPage;
}

export async function doGetResources(page: number = 1, sort: ResourceSort = "Top", search = "", user = "") {
  const sortMap = {"A-Z" : "name ASC", "Top": "upvotes DESC", "New": "id DESC"}
  const resp = await doDBQuery(`SELECT id, name, description, link, variants, meta, upvotes, status, username FROM resources WHERE status LIKE ? AND username LIKE ? AND name LIKE ? ORDER BY ${sortMap[sort]} LIMIT ? OFFSET ?`,
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

//TODO: this is still untested
export async function doUpdateResource(id: number, newData: CommunityResource) {
  const currentData = await getWithPermission(id);
  if (!currentData)
    return 401;
  //TODO: implement update
  //Leave original intact for now, create new entry with "clones" column using original id
  //After approval, replace original content with updated content and delete the clone
  //Only allow one clone of a resource. If one already exists (ie, the original has a "clones" column), update the clone.
  //Clear existing files in S3 before using new files
  const resp = await doDBQuery("INSERT INTO resources (username, name, description, link, variants, meta, contact, clones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) \
    ON DUPLICATE KEY UPDATE username=VALUES(username), name=VALUES(name), description=VALUES(description), link=VALUES(link), variants=VALUES(variants), contact=VALUES(contact), clones=VALUES(clones)",
    [currentData.username!, newData.name + " - Edited", newData.description, newData.link, newData.variants ?? null, newData.meta ?? null, newData.contact ?? null, `${id}`]);
  console.log(resp);
  return resp.status;
}

export async function doToggleResourceVisibility(id: number) {
  const currentData = await getWithPermission(id);
  if (!currentData)
    return 401;
  const resp = await doDBQuery("UPDATE resources SET status = ? WHERE id = ?", [currentData.status == "Hidden" ? "Approved" : currentData.status == "Approved" ? "Hidden" : currentData.status ?? "Unknown", `${id}`]);
  return resp.status;
}

export async function doGetResourceImage(data: CommunityResource) {
  const bucketURL = await getBucketURL();
  return `${bucketURL}/CommunityResources/Images/${data.name.toLowerCase().replaceAll(" ", "-").replaceAll(/[^a-z0-9-_]/g, "")}.webp?v=${data.modified}`;
}

export async function doUploadImage(resource: string, file: File) {
  const currentData = await getWithPermission(resource);
  if (!currentData)
    return 401;
  return uploadFile(`CommunityResources/Images/${currentData.name.toLowerCase().replace(" ", "-")}.webp`, file);
}

export async function doUploadFile(resource: string, file: File) {
  const currentData = await getWithPermission(resource);
  if (!currentData)
    return 401;
  return uploadFile(`CommunityResources/Resources/${currentData.name.toLowerCase().replace(" ", "-")}/${file.name}`, file);
}

export async function doListResourceFiles(resource: string) {
  const currentData = await getWithPermission(resource);
  if (!currentData)
    return null;
  return await listFilesInFolder(`CommunityResources/Resources/${currentData.name.toLowerCase().replace(" ", "-")}`);
}

export async function doGetResourceFile(resource: string, key: string) {
  const currentData = await getWithPermission(resource);
  if (currentData && key.includes(`CommunityResources/Resources/${currentData.name.toLowerCase().replace(" ", "-")}/`)) {
    const file = await getS3File(key);
    const bytes = await file?.Body?.transformToByteArray();
    if (bytes) {
      const fileName = key.replace(`CommunityResources/Resources/${currentData.name.toLowerCase().replace(" ", "-")}/`, "");
      const data = new File([new Uint8Array(bytes)], fileName, {type: file?.ContentType});
      return {file: data, name: fileName};
    }
  }
  return null;
}

export async function doDeleteResource(id: number) {
  const currentData = await getWithPermission(id);
  if (!currentData || ["Hidden", "Denied"].includes(currentData.status ?? ""))
    return 401;
  await delS3File(`CommunityResources/Images/${currentData.name.toLowerCase().replace(" ", "-")}.webp`);
  await clearFilesInFolder(`CommunityResources/Resources/${currentData.name.toLowerCase().replace(" ", "-")}`)
  const resp = await doDBQuery(`DELETE FROM resources WHERE id = ? LIMIT 1`, [`${id}`]);
  return resp.status;
}

async function uploadFile(path: string, file: File) {
  const data = new FormData();
  data.append("file", file);
  return await postS3File(data, path);
}

async function getWithPermission(nameOrId: string | number) {
  //TODO: admin users should pass this
  const session = await getServerSession();
  if (!session?.user?.name)
    return null;
  const currentData = await getResource(`${nameOrId}`);
  if (currentData && currentData.username == session.user.name)
    return currentData;
}

async function getResource(nameOrId: string) {
  const resp = await doDBQuery(`SELECT * FROM resources WHERE name = ? OR id = ? LIMIT 1`, [nameOrId, nameOrId], false);
  if (resp.status == 200)
    return (await resp.json())[0] as CommunityResource;
  return undefined;
}