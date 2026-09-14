"use server"

import bcrypt from "bcryptjs";
import { doDBQuery } from "../Utilities/mysql.utility";

export async function doCreateAccount(formData: FormData) {
  const user = formData.get("username")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const pass = formData.get("password")?.toString() ?? "";
  const conf = formData.get("confirm")?.toString() ?? "";

  if (pass != conf || !user || !email || !pass)
    return 400;

  const duplicateCheck = await doDBQuery("SELECT id FROM users WHERE LOWER(username) = ? OR LOWER(email) = ? LIMIT 1", [user.toLowerCase(), email.toLowerCase()], false);

  if (duplicateCheck.status == 200 && (await duplicateCheck.json()).length > 0)
    return 409;

  const hash = await bcrypt.hash(pass, 10);

  const resp = await doDBQuery("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [user, email, hash]);
  
  return resp.status == 200 ? 201 : 500;
}