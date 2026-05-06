"use client";

import { useState } from "react";
import Modal from "../../Layout/Modal/Modal";
import LoginModalContent from "./LoginModalContent";
import { AuthAction } from "../AuthContextProvider";

export default function AuthModalWrapper({initialAction, closeCallback, successCallback} : {initialAction: AuthAction, closeCallback: () => void, successCallback: () => void}) {
  const [currentFunction, setCurrentFunction] = useState<AuthAction>(initialAction);

  const getModalContent = () => {
    switch(currentFunction) {
      case "Log In":
        return <LoginModalContent contentSwitchCallback={setCurrentFunction} closeCallback={closeCallback} successCallback={successCallback}/>
      default:
        return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>;
    }
  }

  return (
    <Modal fullPage blur closeCallback={closeCallback}>
      <div className="content shadow-lg/80 h-fit">
        {getModalContent()}
      </div>
    </Modal>
  );
}