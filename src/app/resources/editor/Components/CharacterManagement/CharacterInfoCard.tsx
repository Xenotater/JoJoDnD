"use client";

import {CharacterOrFolder} from "@/app/Models/Characters.model";
import Image from "next/image";
import {useCharacterManager} from "./CharacterManagementContext";
import {useSession} from "next-auth/react";
import {BsFolderFill} from "react-icons/bs";
import {useState} from "react";
import { doGetCharacterData } from "@/app/Actions/editor.action";
import CharacterManagementMenu from "./CharacterManagementMenu";
import { useToastController } from "@/app/Components/Layout/Toasts/ToastControllerProvider";
import { useTranslations } from "next-intl";

export default function CharacterInfoCard({data, closeCallback, updateCallback}: {data: CharacterOrFolder, closeCallback: () => void, updateCallback: () => void}) {
  const manager = useCharacterManager();
  const toasts = useToastController();
  const t = useTranslations("Editor.ui");
  const {data: session} = useSession();
  const [imgSrc, setImgSrc] = useState(`${manager.bucketUrl}/Characters/${session?.user.name}_${data.id}.webp`);
  const isFolder = data.parent_id != undefined;

  const handleClick = async () => {
    if (isFolder) {
      const newPath = [...manager.settings.folderPath];
      newPath.push(data);
      manager.updateSetting("folderPath", newPath);
    }
    else {
      const newChar = await doGetCharacterData(data.id);
      if (newChar) {
        manager.save(newChar);
        toasts.displayMessage(t("Character.loaded"), {type: "Success"});
        closeCallback();
      }
    }
  }

  return (
    <div className="h-[250px] w-[204px] relative">
      <CharacterManagementMenu data={data} updateCallback={updateCallback}/>
      <div className="h-[250px] w-[204px] border-2 rounded-sm bg-jj-vibrant-purple text-base hover:shadow-lg/66 cursor-pointer relative" onClick={() => handleClick()}>
        <div className="w-[200px] h-[225px] flex justify-center items-center relative">
          {!isFolder ?
            <Image src={imgSrc} alt={`${data.name}`} onError={() => setImgSrc("/images/misc/placeholder.webp")} fill/>
            : <BsFolderFill size={150} />
          }
          </div>
        <p className="h-[25px] w-full border-t-2 text-center text-lg leading-5 overflow-scroll hideScroll">{data.name}</p>
      </div>
    </div>
  );
}
