"use client";

import { SessionProvider } from "next-auth/react";
import AuthContextProvider from "./AuthContextProvider";

export default function AuthProvider ({children}: {children: React.ReactNode}) {
  return (
    <SessionProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  );
}