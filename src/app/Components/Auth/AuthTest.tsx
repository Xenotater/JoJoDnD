"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthTest() {
  const {data: session} = useSession();

  return (
    <form action={async (formData) => {
      await signIn("credentials", {redirect: false, username: formData.get("username"), password: formData.get("password")})
    }}>
      <p>Test Auth:</p>
      {session?.user ?
        <><b>Hello {session?.user?.name}</b><br/><button onClick={() => signOut()}>Sign Out</button></>
        :
        <>
          <input required name="username" type="text"/>
          <input required name="password" type="password"/>
          <button type="submit">Sign In</button>
        </>
      }
    </form>
  );
}