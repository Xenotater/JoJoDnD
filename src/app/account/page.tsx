"use client";

import { signOut, useSession } from "next-auth/react";
import { useAuth } from "../Components/Auth/AuthContextProvider";
import Divider from "../Components/Layout/Divider/Divider";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import EditAccountModal, { EditAccountAction } from "./Components/EditAccountModal";
import PageTitle from "../Components/Layout/Typography/PageTitle";
import Link from "next/link";
import { BsArrowRight, BsFileEarmark, BsPerson, BsShieldLock } from "react-icons/bs";

//TODO: Consider allowing account deletion
export default function AccountPage() {
  const {data: session, update} = useSession();
  const auth = useAuth();
  const loggedIn = auth.loggedIn && session;
  const t = useTranslations("Auth");
  const [editAction, setEditAction] = useState<EditAccountAction | undefined>(undefined);

  useEffect(() => {
    if (!loggedIn)
      auth.promptAction("Log In");
  }, []);

  return (
    <div>
      <PageTitle title={t("account")}/>
      {!loggedIn ?
        <div className="content">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center mb-2">
              <h2 className="m-0">{t("loggedOut")}</h2>
              <div className="flex sm:justify-center md:max-w-[500px]">
                <button className="w-fit rounded-md text-lg bg-jj-purple-1 text-white h-fit" onClick={() => auth.promptAction("Log In")}>{t("login")}</button>
              </div>
            </div>
          </div>
        </div>
        :
        <div className="content">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center mb-2">
              <h2 className="m-0">{t("welcome", {user: session.user.name!})}</h2>
              <div className="flex sm:justify-center md:max-w-[500px]">
                <button className="w-fit rounded-md text-lg bg-jj-purple-1 text-white h-fit" onClick={() => signOut()}>{t("logout")}</button>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-8">
            <div className="flex flex-col gap-2 md:max-w-[500px] grow">
              <h3>{t("info")}</h3>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="flex flex-col">
                  <h4><b>{t("username")}</b></h4>
                  {session.user.name}
                </div>
                <button className="h-min bg-gray-200 w-fit" onClick={() => setEditAction("Username")}>{t("change")}</button>
              </div>
              <Divider className="m-0"/>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="flex flex-col">
                  <h4><b>{t("email")}</b></h4>
                  {session.user.email}
                </div>
                <button className="h-min bg-gray-200 w-fit" onClick={() => setEditAction("Email")}>{t("change")}</button>
              </div>
              <Divider className="m-0"/>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="flex flex-col">
                  <h4><b>{t("password")}</b></h4>
                </div>
                <button className="h-min bg-gray-200 w-fit" onClick={() => setEditAction("Password")}>{t("change")}</button>
              </div>
              <Divider className="m-0"/>
            </div>
            <div className="flex flex-col gap-2 md:max-w-[500px] grow">
              <h3>{t("content")}</h3>
              <Link href="/resources/editor?viewChars" className="button rounded bg-jj-purple-1 text-lg text-white flex items-center gap-2 mt-2 w-min"><BsPerson/> {t("characters")} <BsArrowRight/></Link>
              <Link href="/resources/community/manage" className="button rounded bg-jj-purple-1 text-lg text-white flex items-center gap-2 mt-2 w-min"><BsFileEarmark/> {t("resources")} <BsArrowRight/></Link>
              {session.user.role == "admin" &&
                <Link href="/resources/admin" className="button rounded bg-jj-purple-1 text-lg text-white flex items-center gap-2 mt-2 w-min whitespace-nowrap"><BsShieldLock/> Admin Console <BsArrowRight/></Link>
              }
            </div>
          </div>
          {editAction &&
            <EditAccountModal type={editAction} closeCallback={() => {
              setEditAction(undefined);
              update();
            }}/>
          }
        </div>
      }
    </div>
  );
}