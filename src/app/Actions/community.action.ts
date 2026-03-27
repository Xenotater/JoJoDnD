"use server";

import { getServerSession } from "next-auth";
import { CommunityResource, ResourceSort } from "../Models/Resources.model";
import { doDBQuery } from "../Utilities/mysql.utility";
import { clearFilesInFolder, delS3File, getBucketURL, getS3File, listFilesInFolder, moveFilesInFolder, moveS3File, postS3File } from "../Utilities/aws.utility";
import { authOptions } from "../api/auth/[...nextauth]/route";

const resourcesPerPage = 12; //TODO: re-evaluate

export async function doGetResourcesPerPage() {
  return resourcesPerPage;
}

export async function doGetResources(page: number = 1, sort: ResourceSort = "Top", search = "", user = "") {
  const sortMap = {"A-Z" : "name ASC", "Top": "upvotes DESC", "New": "id DESC"}
  const resp = await doDBQuery(`SELECT id, name, description, link, variants, meta, upvotes, status, username, clones, modified_ts FROM resources WHERE status LIKE ? AND username LIKE ? AND name LIKE ? ORDER BY ${sortMap[sort]} LIMIT ? OFFSET ?`,
    [user ? "%" : "approved", user || "%", `%${search}%`, resourcesPerPage.toString(), ((page - 1) * resourcesPerPage).toString()], false);
  if (resp.status == 200) {
    return (await resp.json()) as CommunityResource[];
  }
  return null;
}

export async function doCountResourcePages(search = "", user = "") {
  const resp = await doDBQuery(`SELECT COUNT(id) AS 'count' FROM resources  WHERE username LIKE ? AND status LIKE ? AND name LIKE ?`, [user || "%", user ? "%" : "approved", `%${search}%`], false);
  if (resp.status == 200) {
    return Math.ceil((await resp.json())[0].count as number / resourcesPerPage);
  }
  return null;
}

export async function doUpvoteResource(id: number) {
  const session = await getServerSession();
  if (!session?.user?.name)
    return 401;
  const resp = await doDBQuery(`INSERT INTO votes (username, res_id) VALUES (?, ?)`, [session.user.name, `${id}`]);
  if (resp.status == 200) {
    const resp2 = await doDBQuery(`UPDATE resources SET upvotes = upvotes + 1 WHERE id = ?`, [`${id}`], false);
    return resp2.status;
  }
  return resp.status;
}

export async function doDownvoteResource(id: number) {
  const session = await getServerSession();
  if (!session?.user?.name)
    return 401;
  const resp = await doDBQuery(`DELETE FROM votes WHERE username=? AND res_id=?`, [session.user.name, `${id}`]);
  if (resp.status == 200) {
    const resp2 = await doDBQuery(`UPDATE resources SET upvotes = upvotes - 1 WHERE id = ?`, [`${id}`], false);
    return resp2.status;
  }
  return resp.status;
}

export async function doGetUserUpvotes() {
  const session = await getServerSession();
  if (!session?.user?.name)
    return null;
  const resp = await doDBQuery(`SELECT res_id FROM votes WHERE username = ?`, [session.user.name], false);
  return (await resp.json()).map((r: {res_id: number}) => r.res_id) as number[];
}

export async function doSubmitNewResource(data: CommunityResource) {
  const session = await getServerSession();
  if (!session?.user?.name)
    return 401;
  const resp = await doDBQuery("INSERT INTO resources (username, name, description, link, variants, contact) VALUES (?, ?, ?, ?, ?, ?)",
    [session.user.name, data.name, data.description, data.link, data.variants ? data.variants : null, data.contact ? data.contact : null]);
  return resp.status;
}

//TODO: test this more thoroughly
export async function doUpdateResource(id: number, newData: CommunityResource) {
  const currentData = await getWithPermission(id);
  if (!currentData)
    return 401;
  await clearFilesInFolder(`CommunityResources/Resources/${currentData.name.toLowerCase().replaceAll(" ", "-")}-edit`); //clear files before uploading new copies
  const isApprovedEdit = ["Approved", "Hidden"].includes(currentData.status ?? "");
  const existingClone = await (await doDBQuery("SELECT id FROM resources WHERE clones = ?", [`${id}`])).json() as number[];
  if (currentData.clones || existingClone.length > 0) {
    const cloneId = currentData.clones ? currentData.id : existingClone[0];
    const resp = await doDBQuery("UPDATE resources set username=?, name=?, description=?, link=?, variants=?, meta=?, contact=?, modified_ts=CURRENT_TIMESTAMP WHERE id = ?",
      [currentData.username!, newData.name, newData.description, newData.link, newData.variants ?? null, newData.meta ?? null, newData.contact ?? null, `${cloneId}`]);
    return resp.status;
  }
  const resp = await doDBQuery("INSERT INTO resources (username, name, description, link, variants, meta, contact, clones, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [currentData.username!, newData.name, newData.description, newData.link, newData.variants ?? null, newData.meta ?? null, newData.contact ?? null,
      `${isApprovedEdit ? id : null}`, isApprovedEdit ? "Pending Edit" : "Pending"]);
  return resp.status;
}

export async function approveNewResource(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name || session.user.role != "admin")
    return 401;
  const resp = await doDBQuery("UPDATE resources SET status='Approved' WHERE id=?", [`${id}`]);
  return resp.status;
}

export async function approveUpdatedResource(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name || session.user.role != "admin")
    return 401;

  const data = await getResource(`${id}`);
  if (!data)
    return 404;
  const previous = await getResource(`${data.clones}`)
  if (!previous)
    return 404;

  const resp = await doDBQuery("UPDATE resources r, resources r2 SET r.name = r2.name, r.description = r2.description, r.link = r2.link, r.variants = r2.variants, r.meta = r2.meta, \
    r.contact = r2.contact, r.modified_ts = r2.modified_ts WHERE r2.id = ? AND r.id = r2.clones AND r.username = r2.username", [`${id}`]);
  if (resp.status == 200) {
    await doDBQuery("DELETE FROM resources where id = ? LIMIT 1", [`${id}`]);

    await delS3File(`CommunityResources/Images/${previous.name.toLowerCase().replaceAll(" ", "-")}.webp`);
    await clearFilesInFolder(`CommunityResources/Resources/${previous.name.toLowerCase().replaceAll(" ", "-")}`);
    await moveS3File(`CommunityResources/Images/${data.name.toLowerCase().replaceAll(" ", "-")}-edit.webp`, `CommunityResources/Images/${data.name.toLowerCase().replaceAll(" ", "-")}.webp`);
    await moveFilesInFolder(`CommunityResources/Resources/${data.name.toLowerCase().replaceAll(" ", "-")}-edit`, `CommunityResources/Resources/${data.name.toLowerCase().replaceAll(" ", "-")}`);
  }
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
  if (data.clones)
    data.name += "-edit";
  return `${bucketURL}/CommunityResources/Images/${data.name.toLowerCase().replaceAll(" ", "-").replaceAll(/[^a-z0-9-_]/g, "")}.webp?v=${data.modified_ts}`;
}

export async function doUploadImage(resource: string, data: FormData, clones?: number) {
  const currentData = await getWithPermission(resource, clones);
  if (!currentData)
    return 401;
  if (clones)
    currentData.name += "-edit";
  return uploadFile(`CommunityResources/Images/${currentData.name.toLowerCase().replaceAll(" ", "-")}.webp`, data);
}

export async function doUploadFile(resource: string, data: FormData, name: string, clones?: number) {
  const currentData = await getWithPermission(resource, clones);
  if (!currentData)
    return 401;
  if (clones)
    currentData.name += "-edit";
  return uploadFile(`CommunityResources/Resources/${currentData.name.toLowerCase().replaceAll(" ", "-")}/${name.replaceAll(" ", "")}`, data);
}

export async function doListResourceFiles(id: number) {
  const currentData = await getWithPermission(id);
  if (!currentData)
    return null;
  if (currentData.clones)
    currentData.name += "-edit";
  return await listFilesInFolder(`CommunityResources/Resources/${currentData.name.toLowerCase().replaceAll(" ", "-")}`);
}

export async function doGetResourceFile(id: number, key: string) {
  const currentData = await getWithPermission(id);
  if (!currentData)
    return null;
  if (currentData.clones)
    currentData.name += "-edit";
  if (key.includes(`CommunityResources/Resources/${currentData.name.toLowerCase().replaceAll(" ", "-")}/`)) {
    const file = await getS3File(key);
    const bytes = await file?.Body?.transformToByteArray();
    if (bytes) {
      const fileName = key.replace(`CommunityResources/Resources/${currentData.name.toLowerCase().replaceAll(" ", "-")}/`, "");
      const data = new File([new Uint8Array(bytes)], fileName, {type: file?.ContentType});
      return {file: data, name: fileName};
    }
  }
  return null;
}

export async function doDeleteResource(id: number) {
  const currentData = await getWithPermission(id);
  if (!currentData)
    return 401;
  if (currentData.clones)
    currentData.name += "-edit";
  await delS3File(`CommunityResources/Images/${currentData.name.toLowerCase().replaceAll(" ", "-")}.webp`);
  await clearFilesInFolder(`CommunityResources/Resources/${currentData.name.toLowerCase().replaceAll(" ", "-")}`);
  const resp = await doDBQuery(`DELETE FROM resources WHERE id = ? LIMIT 1`, [`${id}`]);
  return resp.status;
}

async function uploadFile(path: string, data: FormData) {
  return await postS3File(data, path);
}

async function getWithPermission(nameOrId: string | number, clones?: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name)
    return null;
  const currentData = await getResource(`${nameOrId}`, clones);
  if (currentData && (currentData.username == session.user.name || session.user.role == "admin"))
    return currentData;
}

async function getResource(nameOrId: string, clones?: number) {
  const resp = await doDBQuery(`SELECT * FROM resources WHERE name = ? OR id = ? AND clones LIKE ? LIMIT 1`, [nameOrId, nameOrId, `${clones ?? "%"}`], false);
  if (resp.status == 200)
    return (await resp.json())[0] as CommunityResource;
  return undefined;
}