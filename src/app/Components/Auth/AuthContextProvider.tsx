"use client";

import { createContext, useContext, useState } from "react";
import AuthModalWrapper from "./AuthModal/AuthModalWrapper";
import { useSession } from "next-auth/react";

export type AuthAction = "None" | "Log In" | "Log Out" | "Sign Up" | "Recovery";

export interface AuthController {
  loggedIn: boolean;
  promptAction: (action: AuthAction) => void;
  authExecute: (callback: () => void) => void;
}

export const AuthContext = createContext<AuthController>({loggedIn: false, promptAction: () => {}, authExecute: () => {}});

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider ({children}: {children: React.ReactNode}) {
  const {data: session} = useSession();
  const [authAction, setAuthAction] = useState<AuthAction>("None");

  return (
    <AuthContext value={{
      loggedIn: !!session?.user,
      promptAction: (action: AuthAction) => {setAuthAction(action)},
      authExecute: (callback: () => void) => {
        if (session?.user)
          callback();
        else
          setAuthAction("Log In");
      }
    }}>
      <>
        {authAction != "None" && 
          <AuthModalWrapper initialAction={authAction} closeCallback={() => setAuthAction("None")}/>
        }
        {children}
      </>
    </AuthContext>
  );
}