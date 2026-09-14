import { log, logError } from "@/app/Utilities/logging.utility"
import { doDBQuery } from "@/app/Utilities/mysql.utility";
import { createHash } from "crypto";
import NextAuth, { NextAuthOptions, RequestInternal, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      authorize: async function (credentials: Record<"username" | "password", string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">): Promise<User | null> {
        const resp = await doDBQuery("SELECT id, username, email, password, role FROM users WHERE username = ? LIMIT 1", [credentials?.username ?? ""], false);
        if (resp.status === 200) {
          const data = (await resp.json())[0] as {id: number, username: string, email: string, password: string, role: string};
          if (data.id) {
            if (await bcrypt.compare(credentials?.password ?? "", data.password))
              return {id: data.id.toString(), name: data.username, email: data.email, role: data.role};

            //try old format
            const oldSalt = data.password.slice(-4);
            const oldHash = data.password.slice(0, -4);
            if (oldHash === createHash("sha512").update(credentials?.password + oldSalt).digest("hex")) {
              //this is a less secure hash, update to new format
              const newHash = await bcrypt.hash(credentials!.password, 10);
              const updateResp = await doDBQuery("UPDATE users SET password = ? WHERE id = ? LIMIT 1", [newHash, data.id.toString()]);
              if (!updateResp || updateResp.status != 200)
                logError("Error updating password format for: " + credentials?.username);
              return {id: data.id.toString(), name: data.username, email: data.email, role: data.role};
            }
          }
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60 //two hours
  },
  jwt: {
    maxAge: 2 * 60 * 60 //two hours
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role as string;
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token
    }
  },
  events: {
    async signIn(message) { log("User signed in: " + message.user.name) },
    async createUser(message) { log("New user created: " + message.user.name) },
    async updateUser(message) { log("User updated account: " + message.user.name) }
  },
  logger: {
    error(code, metadata) {
      logError("From NextAuth: " + code + " - " + metadata.message);
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }