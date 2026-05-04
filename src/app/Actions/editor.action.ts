"use server";

import { getServerSession } from "next-auth";
import { doDBQuery } from "../Utilities/mysql.utility";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Character, CharacterOrFolder } from "../Models/Characters.model";

export async function doGetCharacterData(id: number) {
  return (await getWithPermission(id));
}

async function getWithPermission(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name)
    return null;
  const char = await getCharacter(id);
  if (char && (char?.username == session.user.name || session.user.role == "admin"))
    return char;
  return null;
}

async function getCharacter(id: number) {
  const resp = await doDBQuery('SELECT * FROM characters WHERE id = ? LIMIT 1', [`${id}`]);
  if (resp.status == 200)
    return (await resp.json())[0] as Character;
  return undefined;
}
const charactersPerPage = 11; //TODO: re-evaluate

export async function doGetCharactersPerPage() {
  return charactersPerPage;
}

export async function doGetCharacters(page: number = 1, search = "") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name)
    return null;

  const folders = await doCountFolders(session.user.name, search) ?? 0;
  const folderPages = Math.floor(folders / charactersPerPage)
  const folderOffset = folders % charactersPerPage;
  const foldersThisPage = Math.max(folders - (page - 1) * charactersPerPage, 0);

  const resp = await doDBQuery(`SELECT id, parent_id, username, name FROM folders WHERE username LIKE ? AND name LIKE ? LIMIT ? OFFSET ?`,
    [session.user.name, `%${search}%`, charactersPerPage.toString(), ((page - 1) * charactersPerPage).toString()], false);
  if (page <= folderPages && resp.status == 200) {
    return (await resp.json()) as CharacterOrFolder[];
  }
  const resp2 = await doDBQuery(`SELECT id, folder_id, username, name FROM characters WHERE username LIKE ? AND name LIKE ? LIMIT ? OFFSET ?`,
    [session.user.name, `%${search}%`, (charactersPerPage - foldersThisPage).toString(), ((page - folderPages - 1) * charactersPerPage + folderOffset).toString()], false);
  if (resp.status == 200 && resp2.status == 200) {
    return ((await resp.json()) as CharacterOrFolder[]).concat((await resp2.json()) as CharacterOrFolder[]);
  }
  return null;
}

async function doCountFolders(user = "", search = "") {
  const resp = await doDBQuery(`SELECT COUNT(id) AS 'count' FROM folders WHERE username LIKE ? AND name LIKE ?`,
    [user ? user : "%", `%${search}%`], false);
  if (resp.status == 200) {
    return (await resp.json())[0].count as number;
  }
  return null;
}

export async function doCountCharacterPages(search = "") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name)
    return null;
  const resp = await doDBQuery(`SELECT COUNT(id) AS 'count' FROM folders WHERE username LIKE ? AND name LIKE ?`, [session.user.name, `%${search}%`], false);
  const resp2 = await doDBQuery(`SELECT COUNT(id) AS 'count' FROM characters WHERE username LIKE ? AND name LIKE ?`, [session.user.name, `%${search}%`]);
  if (resp.status == 200 && resp2.status == 200) {
    return Math.ceil(((await resp.json())[0].count as number + (await resp2.json())[0].count as number) / charactersPerPage);
  }
  return null;
}