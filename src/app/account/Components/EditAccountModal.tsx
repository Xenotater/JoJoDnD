"use client";

import { doChangeEmail, doChangePassword, doChangeUsername } from "@/app/Actions/account.action";
import Modal from "@/app/Components/Layout/Modal/Modal";
import { useToastController } from "@/app/Components/Layout/Toasts/ToastControllerProvider";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export type EditAccountAction = "Username" | "Email" | "Password";

export default function EditAccountModal({type, closeCallback}: {type: EditAccountAction, closeCallback: () => void}) {
  const t = useTranslations("Auth");
  const toasts = useToastController();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <Modal fullPage blur closeCallback={closeCallback}>
      <form className="content flex flex-col gap-2" onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const field = data.get("field")?.toString() ?? "";
        const conf = data.get("confirm")?.toString();

        setMessage("");
        setLoading(true);

        if (type != "Username" && field != conf) {
          setMessage(t(`${type.toLowerCase()}Mismatch`));
          setLoading(false);
          return;
        }

        const resp = type == "Username" ? await doChangeUsername(field) : type == "Email" ? await doChangeEmail(field) : await doChangePassword(field);

        switch (resp) {
          case 200:
            toasts.displayMessage(t("updated"), {type: "Success"});
            closeCallback();
            break;
          case 400:
            setMessage(t("fieldLengthErr"));
            break;
          case 409:
            setMessage(t("accountExists"));
            break;
          default:
            setMessage(t("error"));
        }

        setLoading(false);
      }}>
        <h2 className="m-0">{t(`change${type}`)}</h2>
        <p>{t("changeDesc", {field: t(type.toLowerCase()).toLowerCase()})}</p>
        <div>
          <label htmlFor="field">{t(type.toLowerCase())}</label><br/>
          <input className="w-full" required id="field" name="field" type={type == "Password" ? "password" : type == "Email" ? "email" : "text"} maxLength={255} onChange={() => setMessage("")}/>
        </div>
        {type != "Username" &&
          <div>
            <label htmlFor="confirm">{t(type == "Email" ? "confirmEmail" : "confirm")}</label><br/>
            <input className="w-full" required id="confirm" name="confirm" type={type == "Password" ? "password" : type == "Email" ? "email" : "text"} maxLength={255} onChange={() => setMessage("")}/>
          </div>
        }
        <button type="submit" className="text-xl rounded-md bg-jj-purple-1 text-white p-2 flex justify-center" disabled={loading}>
          {loading ?
            <FaSpinner size={20} className="animate-spin"/>
            : t("change")
          }
        </button>
        {message &&
          <span className="text-red-700 animate-flash">{message}</span>
        }
      </form>
    </Modal>
  )
}