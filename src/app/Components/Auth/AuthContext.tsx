import { createContext, useContext } from "react";
import { AuthAction } from "./AuthModal/AuthModalWrapper";
import { Session } from "next-auth";

export interface AuthController {
  loggedIn: boolean;
  session: Session | null;
  promptAction: (action?: AuthAction) => void;
  updateAuthController: (value: AuthController) => void;
}

export const AuthContext = createContext<AuthController>({loggedIn: false, session: null, promptAction: () => {}, updateAuthController: () => {}});

export const useAuth = () => useContext(AuthContext);

export const authExecute = (auth: AuthController, callback: () => void) => {
  if (auth.loggedIn)
    callback();
  else
    auth.promptAction();
}