"use client";

import { signOut } from "next-auth/react";
import { useAuth } from "../Components/Auth/AuthContext";

//TODO: Flesh out this stub page
export default function AccountPage() {
  const auth = useAuth();

  if (!auth.loggedIn)
    return (
      <div>
        <h2>You&apos;re logged out.</h2>
        <button onClick={() => auth.promptAction()}>Log In</button>
      </div>
    );

  return (
    <div>
      <h2>Welcome {auth.session?.user?.name}</h2>
      <button onClick={() => signOut()}>Log Out</button>
    </div>
  );
}