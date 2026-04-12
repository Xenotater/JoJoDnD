"use server";

import { getServerSession } from "next-auth";
import { doDBQuery } from "../Utilities/mysql.utility";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Character } from "../Models/Characters.model";

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