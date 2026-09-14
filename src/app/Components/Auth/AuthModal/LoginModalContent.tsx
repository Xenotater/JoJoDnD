"use client";

import { signIn } from "next-auth/react";
import ContentHeading from "../../Layout/Typography/ContentHeading";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { AuthAction } from "../AuthContextProvider";
import { useToastController } from "../../Layout/Toasts/ToastControllerProvider";
import { useTranslations } from "next-intl";

export default function LoginModalContent({contentSwitchCallback, closeCallback, successCallback}: {contentSwitchCallback: (newAction: AuthAction) => void, closeCallback: () => void, successCallback?: () => void}) {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Auth");
  const toasts = useToastController();

  return (
    <div className="flex flex-col justify-center text-center my-2 mx-4 gap-4 md:w-[275px]">
      <ContentHeading as="h2" className="m-0">{t("login")}</ContentHeading>
      <form className="flex flex-col justify-center gap-4" onSubmit={async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const response = await signIn("credentials", {redirect: false, username: formData.get("username"), password: formData.get("password")});
        setLoading(false);
        if (response && response.ok) {
          setSuccess(true);
          toasts.displayMessage(t("loginSuccess", {"user": formData.get("username")?.toString() ?? ""}), {type: "Success"});
          if (successCallback)
            successCallback();
          setTimeout(() => {closeCallback();}, 100);
        }
        else if (response && response.status == 401)
          setMessage(t("invalidCredentials"));
        else
          setMessage(t("error"));
      }}>
        <div>
          <label htmlFor="user">{t("username")}</label><br/>
          <input required autoFocus id="user" name="username" type="text" onChange={() => setMessage("")}/>
        </div>
        <div>
          <label htmlFor="pass">{t("password")}</label><br/>
          <input required id="pass" name="password" type="password" onChange={() => setMessage("")}/>
        </div>
        <button type="submit" className="text-xl rounded-md bg-jj-purple-1 text-white p-2 flex justify-center" disabled={success || loading}>
          {loading ?
            <FaSpinner size={20} className="animate-spin"/>
            : t("login")
          }
        </button>
      </form>
      <div className="flex justify-around gap-4">
        <a onClick={() => contentSwitchCallback("Sign Up")}>{t("create")}</a>
        <a onClick={() => contentSwitchCallback("Recovery")}>{t("recovery")}</a>
      </div>
      {message &&
        <span className={`${success ? "text-green-700" : "text-red-700"} animate-flash`}>{message}</span>
      }
    </div>
  );
}