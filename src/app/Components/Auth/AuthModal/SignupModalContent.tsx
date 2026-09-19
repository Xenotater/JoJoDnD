"use client";

import { signIn } from "next-auth/react";
import ContentHeading from "../../Layout/Typography/ContentHeading";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { AuthAction } from "../AuthContextProvider";
import { useToastController } from "../../Layout/Toasts/ToastControllerProvider";
import { useTranslations } from "next-intl";
import { doCreateAccount } from "@/app/Actions/account.action";

export default function SingupModalContent({contentSwitchCallback, closeCallback, successCallback}: {contentSwitchCallback: (newAction: AuthAction) => void, closeCallback: () => void, successCallback?: () => void}) {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Auth");
  const toasts = useToastController();

  return (
    <div className="flex flex-col justify-center text-center my-2 mx-4 gap-4 md:w-[275px]">
      <ContentHeading as="h2" className="m-0">{t("signup")}</ContentHeading>
      <form className="flex flex-col justify-center gap-4" onSubmit={async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        if (formData.get("password")?.toString() != formData.get("confirm")?.toString()) {
          setMessage(t("passwordMismatch"));
          setLoading(false);
          return;
        }

        if (formData.entries().find(e => e[1] == "")) {
          setMessage(t("fieldLengthErr"));
          setLoading(false);
          return;
        }

        const response = await doCreateAccount(formData);
        setLoading(false);
        if (response == 201) {
          toasts.displayMessage(t("accountCreated"), {type: "Success"});
          const loginResponse = await signIn("credentials", {redirect: false, username: formData.get("username"), password: formData.get("password")});
          if (loginResponse && loginResponse.ok) {
            setSuccess(true);
            toasts.displayMessage(t("loginSuccess", {"user": formData.get("username")?.toString() ?? ""}), {type: "Success"});
            if (successCallback)
              successCallback();
            setTimeout(() => {closeCallback();}, 100);
          }
          else {
            toasts.displayMessage(t("signupLoginFailed"), {type: "Error", duration: 5000, canClose: true});
            contentSwitchCallback("Log In");
          }
        }
        else if (response == 400)
          setMessage(t("passwordMismatch"));
        else if (response == 409)
          setMessage(t("accountExists"));
        else
          setMessage(t("error"));
      }}>
        <div>
          <label htmlFor="user">{t("username")}</label><br/>
          <input required autoFocus id="user" name="username" type="text" maxLength={255} onChange={() => setMessage("")}/>
        </div>
        <div>
          <label htmlFor="email">{t("email")}</label><br/>
          <input required id="email" name="email" type="email" maxLength={255} onChange={() => setMessage("")}/>
        </div>
        <div>
          <label htmlFor="pass">{t("password")}</label><br/>
          <input required id="pass" name="password" type="password" maxLength={255} onChange={() => setMessage("")}/>
        </div>
        <div>
          <label htmlFor="conf">{t("confirm")}</label><br/>
          <input required id="conf" name="confirm" type="password" maxLength={255} onChange={() => setMessage("")}/>
        </div>
        <button type="submit" className="text-xl rounded-md bg-jj-purple-1 text-white p-2 flex justify-center" disabled={success || loading}>
          {loading ?
            <FaSpinner size={20} className="animate-spin"/>
            : t("signup")
          }
        </button>
      </form>
      <div className="flex justify-around gap-4">
        <a onClick={() => contentSwitchCallback("Log In")}>{t("back")}</a>
      </div>
      {message &&
        <span className={`${success ? "text-green-800" : "text-red-700"} animate-flash`}>{message}</span>
      }
    </div>
  );
}