"use client";

import Modal from "@/app/Components/Layout/Modal/Modal";
import {CharacterOrFolder} from "@/app/Models/Characters.model";
import {useState} from "react";
import {useCharacterManager} from "./CharacterManagementContext";
import {BsX} from "react-icons/bs";
import Input from "@/app/Components/Layout/Forms/Controlled/Input";
import { useTranslations } from "next-intl";
import { doDeleteCharacter, doDeleteFolder, doMoveCharacter, doMoveFolder, doRenameCharacter, doRenameFolder } from "@/app/Actions/editor.action";
import { useAuth } from "@/app/Components/Auth/AuthContextProvider";
import { useToastController } from "@/app/Components/Layout/Toasts/ToastControllerProvider";

export default function CharacterManagementModal({data, action, closer}: {data: CharacterOrFolder; action: "Rename" | "Move" | "Delete", closer: (success: boolean) => void}) {
  const t = useTranslations("Editor.ui");
  const auth = useAuth();
  const manager = useCharacterManager();
  const toasts = useToastController();
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const isFolder = data.parent_id != undefined;

  const handleRename = () => auth.authExecute(async () => {
    let resp;
    if (isFolder)
      resp = await doRenameFolder(data.id, val);
    else
      resp = await doRenameCharacter(data.id, val);

    if (resp == 200) {
        toasts.displayMessage(t(isFolder ? "Folder.renamed" : "Character.renamed"), {type: "Success"});
        closer(true);
    }
    else if (resp == 209) {
      setErr(t("Folder.duplicateFound"));
    }
    else
      setErr(t("error"));
  });

  const handleMove = (moveUp = false) => auth.authExecute(async () => {
    let resp;
    if (isFolder)
      resp = await doMoveFolder(data.id, data.parent_id, val, moveUp);
    else
      resp = await doMoveCharacter(data.id, data.folder_id, val, moveUp);

    if (resp == 200) {
        toasts.displayMessage(t(isFolder ? "Folder.moved" : "Character.moved"), {type: "Success"});
        closer(true);
    }
    else if (resp == 209) {
      setErr(t("Folder.duplicateFound"));
    }
    else
      setErr(t("error"));
  });

  const handleDelete = () => auth.authExecute(async () => {
    if (val != t("delete")) {
      setErr(t("deleteMismatch"));
      return;
    }
    let resp;
    if (isFolder)
      resp = await doDeleteFolder(data.id);
    else
      resp = await doDeleteCharacter(data.id);
    
    if (resp == 200 || resp == 207) {
        toasts.displayMessage(t(isFolder ? "Folder.deleted" : "Character.deleted"), {type: "Success"});
        closer(true);
    }
    else
      setErr(t("error"));
  });

  return (
    <Modal fullPage blur className="z-101" closeCallback={() => closer(false)}>
      <div className="content relative w-full md:w-[33vw] shadow-lg/66">
        <BsX className="absolute top-[-8px] right-[-8px] text-red-800 text-[48px] hover:text-[52px] hover:top-[-10px] hover:right-[-10px] cursor-pointer" onClick={() => closer(false)} />
        {action == "Rename" &&
          <div className="flex flex-col gap-2">
            <h3 className="text-center">{t(`${isFolder ? "Folder" : "Character"}.renamePrompt`)}</h3>
            <Input className="w-full text-lg text-center border-2 bg-white" value={val || data.name} onBlur={(e) => setVal(e.target.value)} onChange={() => setErr("")}/>
            {err &&
              <p className="text-center text-red-700 animate-flash">{err}</p>
            }
            <div className="w-full flex justify-center">
              <button className="bg-gray-300 p-2 py-1 border-2 text-2xl" onClick={handleRename}>{t("renameBtn")}</button>
            </div>
          </div>
        }
        {action == "Move" &&
          <div className="flex flex-col gap-2">
            <h3 className="text-center">{t(`${isFolder ? "Folder" : "Character"}.movePrompt`)}</h3>
            <p className="text-center">{t("moveDesc")}</p>
            <Input className="w-full text-lg text-center border-2 bg-white" value={val} onBlur={(e) => setVal(e.target.value)} onChange={() => setErr("")}/>
            {err &&
              <p className="text-center text-red-700 animate-flash">{err}</p>
            }
            <div className="w-full flex justify-center gap-4">
              <button className="bg-gray-300 p-2 py-1 border-2 text-2xl disabled:bg-gray-400 disabled:hover:cursor-not-allowed" disabled={data.folder_id == 0} onClick={() => handleMove(true)}>{t("moveUpBtn")}</button>
              <button className="bg-gray-300 p-2 py-1 border-2 text-2xl" onClick={() => handleMove()}>{t("moveBtn")}</button>
            </div>
          </div>
        }
        {action == "Delete" &&
          <div className="flex flex-col gap-2">
            <h3 className="text-center">{t(`${isFolder ? "Folder" : "Character"}.deletePrompt`)}</h3>
            <p className="text-center">{t("deleteDesc")}</p>
            <Input className="w-full text-lg text-center border-2 bg-white" value={val} onBlur={(e) => setVal(e.target.value)} onChange={() => setErr("")}/>
            {err &&
              <p className="text-center text-red-700 animate-flash">{err}</p>
            }
            <div className="w-full flex justify-center">
              <button className="bg-gray-300 p-2 py-1 border-2 text-2xl" onClick={handleDelete}>{t("confirmBtn")}</button>
            </div>
          </div>
        }
      </div>
    </Modal>
  );
}
