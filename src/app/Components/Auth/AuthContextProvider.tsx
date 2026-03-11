"use client";
import { AuthContext, AuthController } from "./AuthContext";
import { useEffect, useState } from "react";
import AuthModalWrapper, { AuthAction } from "./AuthModal/AuthModalWrapper";
import { useSession } from "next-auth/react";

export default function AuthContextProvider ({children}: {children: React.ReactNode}) {
  const {data: session} = useSession();
  const [contextValue, setContextValue] = useState<AuthController>({loggedIn: !!session?.user, session: session, promptAction: () => {}, updateAuthController: () => {}});
  const [modalOpen, setModalOpen] = useState(false);
  const [authAction, setAuthAction] = useState<AuthAction>("Log In");

  useEffect(() => {
    setContextValue({...contextValue, session: session, loggedIn: !!session?.user});
  }, [session]);

  useEffect(() => {
    setContextValue({...contextValue, updateAuthController: setContextValue, promptAction: (action?: AuthAction) => {
      if (action)
        setAuthAction(action);
      setModalOpen(true);
    }});
  }, []);

  return (
    <AuthContext value={contextValue}>
      <>
        {modalOpen && 
          <AuthModalWrapper initialAction={authAction} closeCallback={() => setModalOpen(false)}/>
        }
        {children}
      </>
    </AuthContext>
  );
}