"use client";

import Divider from "@/app/Components/Layout/Divider/Divider";
import Modal from "@/app/Components/Layout/Modal/Modal";
import {useCharacterManager} from "./CharacterManagementContext";
import {useToastController} from "@/app/Components/Layout/Toasts/ToastControllerProvider";
import {doCreateFolder} from "@/app/Actions/editor.action";
import {useTranslations} from "next-intl";

export default function NewItemMenu({closeCallback}: {closeCallback: (type?: "folder" | "character") => void}) {
  const manager = useCharacterManager();
  const toasts = useToastController();
  const t = useTranslations("Editor.ui");

  const handleCreate = async (folder = false) => {
    if (!folder) {
      manager.new();
      toasts.displayMessage(t("Character.created"), {type: "Success"});
      closeCallback("character");
    } else {
      const resp = await doCreateFolder();
      if (resp != 200) {
        toasts.displayMessage(t("error"), {type: "Error"});
        closeCallback();
      } else {
        toasts.displayMessage(t("Folder.created"), {type: "Success"});
        closeCallback("folder");
      }
    }
  };

  return (
    <Modal closeCallback={() => closeCallback()}>
      <div className="absolute right-1 top-1 border-2 rounded-md bg-jj-mpurple-1 pt-1 pb-1 z-1 text-base leading-5">
        <a onClick={() => handleCreate()} className="cursor-pointer underline ml-2 mr-2 pr-4 hover:text-gray-800">
          New Character
        </a>
        <Divider className="mt-1 mb-1" />
        <a onClick={() => handleCreate(true)} className="cursor-pointer underline ml-2 mr-2 pr-4 hover:text-gray-800">
          New Folder
        </a>
      </div>
    </Modal>
  );
}
