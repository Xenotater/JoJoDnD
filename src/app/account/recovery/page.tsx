"use client";

import {doChangePassword, doValidateRecoveryCode} from "@/app/Actions/account.action";
import {useAuth} from "@/app/Components/Auth/AuthContextProvider";
import LoadingSpinner from "@/app/Components/Layout/LoadingSpinner/LoadingSpinner";
import {useTranslations} from "next-intl";
import {redirect, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import { FaSpinner } from "react-icons/fa";

export default function AccountRecoveryPage() {
  const auth = useAuth();
  const t = useTranslations("Auth");
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState("");
  const [reset, setReset] = useState(false);

  const checkValid = async () => {
    setLoading(true);
    const resp = await doValidateRecoveryCode(params.get("code") ?? "");
    console.log(resp);
    if (resp == 401) {
      setMessage(t("Recovery.invalid"));
      setValidated(false);
    }
    else if (resp == 500) {
      setMessage(t("error"));
      setValidated(false);
    }
    else {
      setValidated(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkValid();
  }, [params]);

  const handleReset = async (data: FormData) => {
    setMessage("");
    setLoading(true);

    const pass = (data.get("password") ?? "").toString();

    if (pass != data.get("confirm")?.toString()) {
      setMessage(t("passwordMismatch"));
      setLoading(false);
      return;
    }

    if (pass.length <= 0 || pass.length > 255) {
      setMessage(t("fieldLengthErr"));
      setLoading(false);
      return;
    }

    const resp = await doChangePassword(params.get("code") ?? "", pass);

    if (resp == 200)
      setReset(true);
    else {
      setValidated(false);
      setMessage(resp == 401 ? t("Recovery.invalid") : t("error"));
    }

    setLoading(false);
  }

  if (auth.loggedIn) return redirect("/account");

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="text-center">{t("recovery")}</h1>
      <div className="content text-center flex flex-col gap-2 items-center">
      {loading ?
        <LoadingSpinner className="max-w-[25%]"/>
        : reset ?
          <div className="flex flex-col gap-2 items-center">
            <h2>{t("Recovery.success")}</h2>
            <p>{t("Recovery.successPrompt")}</p>
            <button className="text-xl rounded-md bg-jj-purple-1 text-white p-2 flex justify-center" onClick={() => redirect("/account")}>{t("account")}</button>
          </div>
        :
        <>
          {validated ?
            <form className="flex flex-col gap-2 items-center" onSubmit={(e) => {
              console.log("submitting");
              e.preventDefault();
              handleReset(new FormData(e.currentTarget));
            }}>
              <h3>{t("Recovery.endPrompt")}</h3>
              <p>{t("Recovery.endDesc")}</p>
              <div>
                <label htmlFor="pass">{t("password")}</label><br/>
                <input required id="pass" name="password" type="password" maxLength={255} onChange={() => setMessage("")}/>
              </div>
              <div>
                <label htmlFor="conf">{t("confirm")}</label><br/>
                <input required id="conf" name="confirm" type="password" maxLength={255} onChange={() => setMessage("")}/>
              </div>
              <button type="submit" className="text-xl rounded-md bg-jj-purple-1 text-white p-2 flex justify-center" disabled={reset || loading}>
                {loading ?
                  <FaSpinner size={20} className="animate-spin"/>
                  : t("Recovery.resetPassword")
                }
              </button>
              {message &&
                <span className="text-red-700 animate-flash">{message}</span>
              }
            </form>
            :
            <div className="flex flex-col gap-2 items-center">
              <h3>{t("Recovery.noValid")}</h3>
              <p>{message}</p>
              <button className="rounded-sm bg-white max-w-[200px]" onClick={() => auth.promptAction("Recovery")}>{t("Recovery.again")}</button>
            </div>
            }
        </>
      }
      </div>
    </div>
  );
}
