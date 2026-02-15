"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthTest() {
  const {data: session} = useSession();

  return (
    <div>
      <p>Test Auth:</p>
      <button onClick={() => signIn()}>Sign In</button><button onClick={() => signOut()}>Sign Out</button><br/>
      {session?.user &&
        <b>Hello {session?.user?.name}</b>
      }
    </div>
  );
}