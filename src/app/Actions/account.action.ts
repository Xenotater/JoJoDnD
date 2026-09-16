"use server"

import bcrypt from "bcryptjs";
import { doDBQuery } from "../Utilities/mysql.utility";
import { sendEmail } from "../Utilities/aws.utility";
import { RecoveryEmailBody } from "../Components/Emails/RecoveryEmail";
import { logError } from "../Utilities/logging.utility";

export async function doCreateAccount(formData: FormData) {
  const user = formData.get("username")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const pass = formData.get("password")?.toString() ?? "";
  const conf = formData.get("confirm")?.toString() ?? "";

  if (pass != conf || !user || !email || !pass)
    return 400;

  const duplicateCheck = await doDBQuery("SELECT id FROM users WHERE LOWER(username) = ? OR LOWER(email) = ? LIMIT 1", [user.toLowerCase(), email.toLowerCase()], false);

  if (duplicateCheck?.status == 200 && (await duplicateCheck.json()).length > 0)
    return 409;

  const hash = await bcrypt.hash(pass, 10);

  const resp = await doDBQuery("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [user, email, hash]);
  
  return resp.status == 200 ? 201 : 500;
}

export async function doSendRecoveryEmail(email: string) {
  const userResp = await doDBQuery("SELECT username FROM users WHERE LOWER(email) = ? LIMIT 1", [email.toLowerCase()], false);

  if (userResp?.status == 200) {
    const user = (await userResp.json())[0].username as string;

    if (user) {
      const code = crypto.randomUUID();
      const codeHash = await bcrypt.hash(code, 10);

      //delete old codes before creating new ones
      await doDBQuery("DELETE FROM recovery WHERE TIMESTAMPADD(HOUR, 1, created) < CURRENT_TIMESTAMP OR user = ?", [user]);
      const codeResp = await doDBQuery("INSERT INTO recovery (user, code) VALUES (?, ?)", [user, codeHash]);

      if (codeResp?.status == 200) {
        const { renderToStaticMarkup } = await import('react-dom/server');
        const resp = await sendEmail("recovery", email, "Account Recovery", renderToStaticMarkup(RecoveryEmailBody({user, code})));
        if (!resp)
          return 500;
      }
      else {
        logError("Failed to save recovery code for " + user);
        return 500;
      }
    }
  }

  return 200; //return success regardless of whether an account existed or not
}

export async function doValidateRecoveryCode(code: string) {
  
}