"use server";

import {getServerSession} from "next-auth";
import {doDBQuery} from "../Utilities/mysql.utility";
import {authOptions} from "../api/auth/[...nextauth]/route";
import {Character, CharacterData, CharacterOrFolder} from "../Models/Characters.model";
import {formToJson, jsonToForm} from "../Utilities/misc.utility";
import {getBucketURL, postS3File} from "../Utilities/aws.utility";

export async function doGetCharacterData(id: number) {
  return await getWithPermission(id);
}

async function getWithPermission(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return null;
  const char = await getCharacter(id);
  if (char && (char?.username == session.user.name || session.user.role == "admin")) return char;
  return null;
}

async function getCharacter(id: number) {
  const resp = await doDBQuery("SELECT id, username, name, data, folder_id, modified_ts FROM characters WHERE id = ? LIMIT 1", [`${id}`]);
  if (resp.status == 200) {
    const char: {id: number; username: string; name: string; data: string; folder_id: number; modified_ts: Date} = (await resp.json())[0];
    const data = formToJson<CharacterData>(JSON.parse(char.data));
    const img = `${await getBucketURL()}/Characters/${char.username}_${char.id}.webp?v=${char.modified_ts}`;
    const img2 = `${await getBucketURL()}/Characters/${char.username}_${char.id}_alt.webp?v=${char.modified_ts}`;
    return {...char, img, img2, data} as Character;
  }
  return undefined;
}

export async function saveCharacterData(data: Character) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return null;
  const existing = data.id != -1 ? await getCharacter(data.id) : null;
  if (existing && existing.username != session.user.name) return null;
  if (existing) {
    const resp = await doDBQuery("UPDATE characters SET name = ?, data = ?, folder_id = ?, modified_ts=CURRENT_TIMESTAMP WHERE id = ? AND username = ? LIMIT 1", [data.name, JSON.stringify(jsonToForm(data.data)), `${data.folder_id}`, `${existing.id}`, session.user.name]);
    if (resp.status != 200)
      return null;
    return existing.id;
  } else {
    const resp = await doDBQuery("INSERT INTO characters (username, name, data, folder_id) VALUES (?, ?, ?, ?)", [session.user.name, data.name || data.data.name, JSON.stringify(jsonToForm(data.data)), `${data.folder_id}`]);
    if (resp.status != 200)
      return null
    return (await resp.json()).insertId;
  }
}

const charactersPerPage = 11; //TODO: re-evaluate

export async function doGetCharactersPerPage() {
  return charactersPerPage;
}

export async function doGetCharacters(page: number = 1, search = "", folder?: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return null;

  const folders = (await doCountFolders(session.user.name, search, folder)) ?? 0;
  const folderPages = Math.floor(folders / charactersPerPage);
  const folderOffset = folders % charactersPerPage;
  const foldersThisPage = Math.max(folders - (page - 1) * charactersPerPage, 0);

  const resp = await doDBQuery(`SELECT id, parent_id, username, name FROM folders WHERE username = ? AND name LIKE ? AND parent_id = ? LIMIT ? OFFSET ?`, [session.user.name, `%${search}%`, folder ? `${folder}` : "parent_id", charactersPerPage.toString(), ((page - 1) * charactersPerPage).toString()], false);
  if (page <= folderPages && resp.status == 200) {
    return (await resp.json()) as CharacterOrFolder[];
  }
  const resp2 = await doDBQuery(`SELECT id, folder_id, username, name FROM characters WHERE username = ? AND name LIKE ? AND folder_id = ? LIMIT ? OFFSET ?`, [session.user.name, `%${search}%`, folder ? `${folder}` : "folder_id", (charactersPerPage - foldersThisPage).toString(), ((page - folderPages - 1) * charactersPerPage - (page - folderPages > 1 ? folderOffset : 0)).toString()]);
  if (resp.status == 200 && resp2.status == 200) {
    return ((await resp.json()) as CharacterOrFolder[]).concat((await resp2.json()) as CharacterOrFolder[]);
  }
  return null;
}

async function doCountFolders(user = "", search = "", folder?: number) {
  const resp = await doDBQuery(`SELECT COUNT(id) AS 'count' FROM folders WHERE username = ? AND name LIKE ? AND parent_id = ?`, [user ? user : "%", `%${search}%`, folder ? `${folder}` : "parent_id"], false);
  if (resp.status == 200) {
    return (await resp.json())[0].count as number;
  }
  return null;
}

export async function doCountCharacterPages(search = "", folder?: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return null;
  const resp = await doDBQuery(`SELECT COUNT(id) AS 'count' FROM folders WHERE username = ? AND name LIKE ? AND parent_id = ?`, [session.user.name, `%${search}%`, folder ? `${folder}` : "parent_id"], false);
  const resp2 = await doDBQuery(`SELECT COUNT(id) AS 'count' FROM characters WHERE username = ? AND name LIKE ? AND folder_id = ?`, [session.user.name, `%${search}%`, folder ? `${folder}` : "folder_id"], false);
  if (resp.status == 200 && resp2.status == 200) {
    return Math.ceil(((((await resp.json())[0].count as number) + (await resp2.json())[0].count) as number) / charactersPerPage);
  }
  return null;
}

export async function uploadCharacterImage(fileData: FormData, id: number, isAlt = false) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return 401;

  return await postS3File(fileData, `Characters/${session.user.name}_${id}${isAlt ? "_alt" : ""}.webp`);
}
