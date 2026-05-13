"use server";

import {getServerSession} from "next-auth";
import {doDBQuery} from "../Utilities/mysql.utility";
import {authOptions} from "../api/auth/[...nextauth]/route";
import {Character, CharacterData, CharacterFolder, CharacterOrFolder} from "../Models/Characters.model";
import {formToJson, jsonToForm} from "../Utilities/misc.utility";
import {copyS3File, delS3File, getBucketURL, postS3File} from "../Utilities/aws.utility";

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

export async function doSaveCharacterData(data: Character) {
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
    return Math.ceil(((((await resp.json())[0].count as number) + (await resp2.json())[0].count) as number) / charactersPerPage) || 1;
  }
  return null;
}

export async function doUploadCharacterImage(fileData: FormData, id: number, isAlt = false) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return 401;

  return await postS3File(fileData, `Characters/${session.user.name}_${id}${isAlt ? "_alt" : ""}.webp`);
}

export async function doDuplicateCharacter(id: number, currentFolder = 0) {
  const char = await getWithPermission(id);
  if (!char)
    return 401;
  const resp = await doSaveCharacterData({...char, id: -1, folder_id: currentFolder});
  if (resp != null) {
    await copyS3File(`Characters/${char.username}_${char.id}.webp`, `Characters/${char.username}_${resp}.webp`, false);
    await copyS3File(`Characters/${char.username}_${char.id}_alt.webp`, `Characters/${char.username}_${resp}_alt.webp`, false);
  return 200;
  }
  return 500;
}

export async function doRenameCharacter(id: number, name: string) {
  const char = await getWithPermission(id);
  if (!char)
    return 401;
  const resp = doSaveCharacterData({...char, name});
  return resp == null ? 500 : 200;
}

export async function doDeleteCharacter(id: number) {
  const char = await getWithPermission(id);
  if (!char)
    return 401;
  const resp = await doDBQuery(`DELETE FROM characters WHERE id = ? LIMIT 1`, [`${id}`]);
  if (resp != null) {
    await delS3File(`Characters/${char.username}_${char.id}.webp`, false);
    await delS3File(`Characters/${char.username}_${char.id}_alt.webp`, false);
  }
  return resp.status;
}

export async function doMoveCharacter(id: number, currentFolder = 0, newPath = "", back = false) {
  const char = await getWithPermission(id);
  if (!char)
    return 401;
  if (back) {
    if (char.folder_id == 0)
      return 400;
    const resp = await doDBQuery(`SELECT parent_id FROM folders WHERE id = ?`, [`${char.folder_id}`], false);
    const newId = (await resp.json())[0].parent_id;
    const resp2 = await doSaveCharacterData({...char, folder_id: parseInt(newId)})
    return resp2 == null ? 500 : 200;
  }
  else if (newPath) {
    const existingFolder = await (await doDBQuery(`SELECT id FROM folders WHERE parent_id = ? AND name = ? LIMIT 1`, [`${currentFolder}`, newPath], false)).json() as {id: number}[];
    if (existingFolder.length == 0) {
      const resp = await doDBQuery(`INSERT INTO folders (name, username, parent_id) VALUES (?, ?, ?)`, [newPath, char.username, `${currentFolder}`]);
      const newId = (await resp.json()).insertId;
      const resp2 = await doSaveCharacterData({...char, folder_id: parseInt(newId)})
      return resp2 == null ? 500 : 200;
    }
    else {
      const resp = await doSaveCharacterData({...char, folder_id: parseInt(`${existingFolder[0].id}`)});
      return resp == null ? 500 : 200;
    }
  }
  return 400;
}

async function getFolderWithPermission(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return null;
  const resp = await doDBQuery(`SELECT * FROM folders WHERE id = ? LIMIT 1`, [`${id}`]);
  if (resp.status == 200) {
    const folder = (await resp.json())[0] as CharacterFolder;
    if (folder && (folder?.username == session.user.name || session.user.role == "admin")) return folder;
  }
  return null;
}

export async function doDuplicateFolder(id: number, currentFolder = 0, nested = false) {
  if (id == 0)
    return 422;
  const folder = await getFolderWithPermission(id);
  if (!folder)
    return 401;
  let suffix = "";
  let copyFound = true;
  while (!nested && copyFound) {
    copyFound = false;
    const nameCheck = await doDBQuery(`SELECT id FROM folders WHERE name = ? AND parent_id = ?`, [folder.name + suffix, `${currentFolder}`]);
    if (nameCheck.status != 200)
      return 500;
    const duplicates = await nameCheck.json();
    if (duplicates.length > 0) {
      copyFound = true;
      suffix += "-copy";
    }
  }
  const resp = await doDBQuery(`INSERT INTO folders (name, username, parent_id) VALUES (?, ?, ?)`, [folder.name + suffix, folder.username, `${currentFolder}`]);
  if (resp.status == 200) {
    const newId = (await resp.json()).insertId;
    let nestedStatus = 200;
    const characterResp = await doDBQuery(`SELECT id FROM characters WHERE folder_id = ?`, [`${folder.id}`]);
    if (characterResp.status == 200) {
      const characters = await characterResp.json() as {id: number}[];
      if (characters.length > 0) {
        characters.forEach(async (c) => {
          const resp = await doDuplicateCharacter(c.id, newId);
          if (resp != 200 && nestedStatus != 207)
            nestedStatus = 207;
        })
      }
    }
    const foldersResp = await doDBQuery(`SELECT id FROM folders WHERE parent_id = ?`, [`${folder.id}`], false);
    if (foldersResp.status == 200) {
      const folders = await foldersResp.json() as {id: number}[];
      if (folders.length > 0) {
        folders.forEach(async (f) => {
          const resp = await doDuplicateFolder(f.id, newId, true);
          if (resp != 200 && nestedStatus != 207)
            nestedStatus = 207;
        })
      }
    }
    return nestedStatus;
  }
  return resp.status;
}

export async function doRenameFolder(id: number, name: string) {
  if (id == 0)
    return 422;
  const folder = await getFolderWithPermission(id);
  if (!folder)
    return 401;
  const nameCheck = await doDBQuery(`SELECT id FROM folders WHERE name = ? AND parent_id = ?`, [name, `${folder.parent_id}`]);
  if (nameCheck.status != 200)
    return 500;
  const duplicates = await nameCheck.json();
  if (duplicates.length > 0)
    return 209;
  const resp = await doDBQuery(`UPDATE folders SET name = ? WHERE id = ?`, [name, `${folder.id}`], false);
  return resp.status;
}

export async function doDeleteFolder(id: number) {
  if (id == 0)
    return 422;
  const folder = await getFolderWithPermission(id);
  if (!folder)
    return 401;
  const resp = await doDBQuery(`DELETE FROM folders WHERE id = ? LIMIT 1`, [`${folder.id}`]);
  if (resp.status == 200) {
    let nestedStatus = 200;
    const characterResp = await doDBQuery(`SELECT id FROM characters WHERE folder_id = ?`, [`${folder.id}`]);
    if (characterResp.status == 200) {
      const characters = await characterResp.json() as {id: number}[];
      if (characters.length > 0) {
        characters.forEach(async (c) => {
          const resp = await doDeleteCharacter(c.id);
          if (resp != 200 && nestedStatus != 207)
            nestedStatus = 207;
        })
      }
    }
    const foldersResp = await doDBQuery(`SELECT id FROM folders WHERE parent_id = ?`, [`${folder.id}`], false);
    if (foldersResp.status == 200) {
      const folders = await foldersResp.json() as {id: number}[];
      if (folders.length > 0) {
        folders.forEach(async (f) => {
          const resp = await doDeleteFolder(f.id);
          if (resp != 200 && nestedStatus != 207)
            nestedStatus = 207;
        })
      }
    }
    return nestedStatus;
  }
  return resp.status;
}

export async function doMoveFolder(id: number, currentFolder = 0, newPath = "", back = false) {
  if (id == 0)
    return 422;
  const folder = await getFolderWithPermission(id);
  if (!folder)
    return 401;
  if (back) {
    if (folder.parent_id == 0)
      return 400;
    const resp = await doDBQuery(`SELECT parent_id FROM folders WHERE id = ?`, [`${folder.parent_id}`], false);
    const newId = (await resp.json())[0];
    const resp2 = await doDBQuery(`UPDATE folders SET parent_id = ? WHERE id = ?`, [newId, `${folder.id}`], false);
    return resp2.status;
  }
  else if (newPath) {
    const existingFolder = await (await doDBQuery(`SELECT id FROM folders WHERE parent_id = ? AND name = ? LIMIT 1`, [`${currentFolder}`, newPath], false)).json() as {id: number}[];
    console.log("existing:");
    console.log(existingFolder);
    if (existingFolder.length == 0) {
      const resp = await doDBQuery(`INSERT INTO folders (name, username, parent_id) VALUES (?, ?, ?)`, [newPath, folder.username, `${currentFolder}`], false);
      const newId = (await resp.json()).insertId;
      const resp2 = await doDBQuery(`UPDATE folders SET parent_id = ? WHERE id = ?`, [newId, `${folder.id}`], false);
      return resp2.status;
    }
    else {
      const existingId = existingFolder[0].id;
      const nameCheck = await doDBQuery(`SELECT id FROM folders WHERE name = ? AND parent_id = ?`, [folder.name, `${existingId}`]);
      if (nameCheck.status != 200)
        return 500;
      const duplicates = await nameCheck.json();
      if (duplicates.length > 0)
        return 209;
      const resp = await doDBQuery(`UPDATE folders SET parent_id = ? WHERE id = ?`, [`${existingId}`, `${folder.id}`], false);
      return resp.status;
    }
  }
  return 400;
}
//TODO: log weirder errors, like 422 and 207 here or from the client