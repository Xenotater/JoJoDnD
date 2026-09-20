"use client";

import ContentHeading from "../../Layout/Typography/ContentHeading";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { AuthAction } from "../AuthContextProvider";
import { useTranslations } from "next-intl";
import { doSendRecoveryEmail } from "@/app/Actions/account.action";
import { usePathname } from "next/navigation";

export default function RecoveryModalContent({contentSwitchCallback}: {contentSwitchCallback: (newAction: AuthAction) => void}) {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Auth");
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-center text-center my-2 mx-4 gap-4 md:w-[275px]">
      <ContentHeading as="h2" className="m-0">{t("recovery")}</ContentHeading>
      <form className="flex flex-col justify-center gap-4" onSubmit={async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const response = await doSendRecoveryEmail(formData.get("email")?.toString() ?? "");
        setLoading(false);
        if (response == 200) {
            setSuccess(true);
            setMessage(t("Recovery.sent"));
        }
        else
          setMessage(response == 400 ? t("fieldLengthErr") : t("error"));
      }}>
        <h4>{t("Recovery.startPrompt")}</h4>
        <p>{t("Recovery.startDesc")}</p>
        <div>
          <label htmlFor="user">{t("email")}</label><br/>
          <input required autoFocus id="email" name="email" type="email" maxLength={255} placeholder="diobrando@wryyyyy.com" onChange={() => setMessage("")}/>
        </div>
        <button type="submit" className="text-xl rounded-md bg-jj-purple-1 text-white p-2 flex justify-center" disabled={loading}>
          {loading ?
            <FaSpinner size={20} className="animate-spin"/>
            : t("Recovery.submit")
          }
        </button>
      </form>
        {!pathname.includes("recovery") &&
          <div className="flex justify-around gap-4">
              <a onClick={() => contentSwitchCallback("Log In")}>{t("back")}</a>
          </div>
        }
      {message &&
        <span className={`${success ? "text-green-800" : "text-red-700"} animate-flash`}>{message}</span>
      }
    </div>
  );
}