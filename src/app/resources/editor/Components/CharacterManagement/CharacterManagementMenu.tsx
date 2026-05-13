"use client";

import Divider from "@/app/Components/Layout/Divider/Divider";
import Modal from "@/app/Components/Layout/Modal/Modal";
import { useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { useCharacterManager } from "./CharacterManagementContext";
import { CharacterOrFolder } from "@/app/Models/Characters.model";
import { useToastController } from "@/app/Components/Layout/Toasts/ToastControllerProvider";
import { doDuplicateCharacter, doDuplicateFolder } from "@/app/Actions/editor.action";

export default function CharacterManagementMenu({data, updateCallback}: {data: CharacterOrFolder, updateCallback: () => void}) {
  const manager = useCharacterManager();
  const toasts = useToastController();
  const [open, setOpen] = useState(false);
  
  const handleDuplicate = async () => {
    const isFolder = data.parent_id != undefined;
    const itemName = isFolder ? "Folder" : "Character";
    const resp = isFolder ? await doDuplicateFolder(data.id, data.parent_id) : await doDuplicateCharacter(data.id, data.folder_id);
    switch (resp) {
      case 200:
        toasts.displayMessage(`Your ${itemName} has been duplicated`, {type: "Success"});
        break;
      case 422:
        toasts.displayMessage("The root folder cannot be duplicated", {type: "Error"});
        break;
      default:
        toasts.displayMessage("An error ocurred", {type: "Error"});
    }
    updateCallback();
  }

  return (
    <>
      <div className="absolute top-[-8px] right-[-8px] flex items-center">
        <div className="p-1.5 bg-jj-purple-1 border rounded-[50%] cursor-pointer hover:shadow-sm/33 z-2">
          <BsGearFill size={20} color="white" onClick={() => setOpen(!open)}/>
        </div>
      </div>
      {open &&
        <Modal closeCallback={() => setOpen(false)}>
          <div className="absolute right-1 top-1 border-2 rounded-md bg-jj-mpurple-1 pt-1 pb-1 z-1 text-base leading-5">
            <a onClick={() => manager.rename(data)} className="cursor-pointer underline ml-2 mr-2 pr-4 hover:text-gray-800">Rename</a>
            <Divider className="mt-1 mb-1"/>
            <a onClick={() => manager.move(data)} className="cursor-pointer underline ml-2 mr-2 pr-4 hover:text-gray-800">Move</a>
            <Divider className="mt-1 mb-1"/>
            <a onClick={handleDuplicate} className="cursor-pointer underline ml-2 mr-2 pr-4 hover:text-gray-800">Duplicate</a>
            <Divider className="mt-1 mb-1"/>
            <a onClick={() => manager.delete(data)} className="cursor-pointer underline ml-2 mr-2 pr-4 text-red-800 hover:text-gray-700">Delete</a>
          </div>
        </Modal>
      }
    </>
  );
}