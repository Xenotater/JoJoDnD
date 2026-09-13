"use client";

import { doDeleteResource } from "@/app/Actions/community.action";
import Modal from "@/app/Components/Layout/Modal/Modal";
import { useToastController } from "@/app/Components/Layout/Toasts/ToastControllerProvider";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { CommunityResource } from "@/app/Models/Resources.model";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DeleteResourceModal({data, closer}: {data: CommunityResource, closer: () => void}) {
  const [name, setName] = useState("");
  const [alert, setAlert] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const t = useTranslations("Community");
  const toasts = useToastController();

  const handleDelete = async () => {
    setAlert("");
    if (name == data.name) {
      const resp = await doDeleteResource(data.id);
      if (resp == 200){
        router.replace(`${pathname}?${params.toString()}&success=true`);
        toasts.displayMessage(t("deleted"), {type: "Success"});
        closer();
      }
      else
        setAlert(t("error"));
    }
    else
      setAlert(t("noMatch"));
  }

  return (
    <Modal fullPage closeCallback={closer}>
      <form className="content max-w-[50vw] flex flex-col gap-2 text-center items-center" onSubmit={(e) => {e.preventDefault(); handleDelete()}}>
        <ContentHeading as="h2" className="m-0">{t("deleteTitle")}</ContentHeading>
        <p>{t.rich("deleteDesc", {
          important: (chunks) => <b>{chunks}</b>,
          name: data.name
        })}</p>
        <p>{t("deleteWarn")}</p>
        <input className="max-w-[80%] text-xl" onChange={(e) => {setAlert(""); setName(e.target.value);}}/>
        <div className="w-full flex justify-around mt-2">
          <button className="rounded-md text-2xl bg-gray-200" onClick={closer}>{t("cancel")}</button>
          <button className="text-2xl rounded-md bg-jj-purple-1 text-white" type="submit">{t("delete")}</button>
        </div>
        {alert &&
          <p className="text-red-800 flex gap-1 justify-center animate-flash">{alert}</p>
        }
      </form>
    </Modal>
  );
}