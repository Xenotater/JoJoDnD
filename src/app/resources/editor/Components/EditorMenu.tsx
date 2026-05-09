"use client";

import Divider from "@/app/Components/Layout/Divider/Divider";
import IconButton from "@/app/Components/Layout/IconButton/IconButton";
import Modal from "@/app/Components/Layout/Modal/Modal";
import Link from "next/link";
import {useRef, useState} from "react";
import {BsList, BsPerson} from "react-icons/bs";
import {HiOutlineUserGroup} from "react-icons/hi";
import {useCharacterManager} from "./CharacterManagement/CharacterManagementContext";
import {TbFileExport, TbFileImport} from "react-icons/tb";
import ToggleSwitch from "@/app/Components/Layout/ToggleSwitch/ToggleSwitch";
import { Character, CharacterData } from "@/app/Models/Characters.model";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import CharactersModal from "./CharacterManagement/CharactersModal";
import { useAuth } from "@/app/Components/Auth/AuthContextProvider";
import { formToJson, jsonToForm } from "@/app/Utilities/misc.utility";

export default function EditorMenu() {
  const {data: session} = useSession();
  const auth = useAuth();
  const manager = useCharacterManager();
  const [menuOpen, setMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const exportRef = useRef<HTMLAnchorElement>(null);
  const t = useTranslations("Editor");

  const toggleMenu = (state = !menuOpen) => {
    if (state) {
      setMenuOpen(true);
      setTimeout(() => setAnimate(true), 0);
    } else {
      setAnimate(false);
      setTimeout(() => setMenuOpen(false), 100);
    }
  };

  const handleImport = async (files: FileList | null) => {
    if (files && files[0]) {
      try {
        const data = JSON.parse(await (files[0]).text()) as {form: string, img: string, img2: string};
        const form = formToJson<CharacterData>(JSON.parse(data.form));
        manager.save({
          id: -1,
          name: form.name,
          username: session?.user.name ?? "",
          folder_id: 0,
          img: data.img,
          img2: data.img2,
          data: form,
        } as Character);
        setMenuOpen(false);
      }
      catch {
        //TODO: implement toast alerts instead
        alert("Invalid character data.")
      }
    }
    if (importRef.current)
      importRef.current.value = '';
  }

  const handleExport = async () => {
    if (exportRef.current && manager.loadedCharacter) {
      const link = exportRef.current;

      const char = manager.loadedCharacter;
      const formData = jsonToForm(char.data);
      const blob = new Blob([JSON.stringify({form: JSON.stringify(formData), img: char.img, img2: char.img2})]);
      const url = URL.createObjectURL(blob);

      link.href = url;
      link.download = `${char.data.name.toLowerCase().replace(" ", "_")}_data.json`;

      link.click();
    }
  }

  return (
    <Modal closeCallback={() => toggleMenu(false)}>
      <div>
        <IconButton onClick={() => toggleMenu()} className="bg-jj-purple-1 relative z-2">
          <BsList className="text-white" size="24" />
        </IconButton>
        {menuOpen && (
          <div className={`absolute top-[42px] left-[16px] z-1 transform transition duration-100 ${animate ? "scale-100" : "scale-0"}`}>
            <div className="w-[44px] h-[60px] aspect-1/1 border-2 border-t-0 z-2 bg-jj-purple-1" />
            <div className="border-2 whitespace-nowrap z-1 absolute top-[20px] rounded-lg rounded-tl-4xl bg-jj-purple-1 p-2 shadow-md/30 w-[200px]">
              <Link href="/account" className="flex gap-2 text-white items-center hover:underline">
                <BsPerson size={24} />
                <span>{t("ui.account")}</span>
              </Link>
              <Divider className="border-white mb-2 mt-2" />
              <Link href="" onClick={() => auth.authExecute(() => {toggleMenu(false); setModalOpen(true)})} className="flex gap-2 text-white items-center hover:underline">
                <HiOutlineUserGroup size={24} />
                <span>{t("ui.characters")}</span>
              </Link>
              <Divider className="border-white mb-2 mt-2" />
              <Link href="" onClick={() => {if (importRef.current) importRef.current.click()}} className="flex gap-2 text-white items-center hover:underline">
                <TbFileImport size={24} />
                <span>{t("ui.import")}</span>
              </Link>
              <Divider className="border-white mb-2 mt-2" />
              <Link href="" onClick={() => handleExport()} className="flex gap-2 text-white items-center hover:underline">
                <TbFileExport size={24} />
                <span>{t("ui.export")}</span>
              </Link>
              <Divider className="border-white mb-2 mt-2" />
              <div className="flex w-full flex-col items-center text-white">
                <label className="text-lg">{t("ui.autofill")}</label>
                <div className="flex w-full justify-center items-center">
                  <span className="text-lg">{t("ui.off")}</span>
                  <ToggleSwitch value={manager.settings.autofill} width={50} borderColor="black" onColor="mediumpurple" callback={() => manager.updateSetting("autofill", !manager.settings.autofill)} className="mx-4"/>
                  <span className="text-lg">{t("ui.on")}</span>
                </div>
              </div>
              <Divider className="border-white mb-2 mt-2" />
              <div className="flex w-full flex-col items-center text-white">
                <label className="text-lg">{t("ui.stats")}</label>
                <div className="flex w-full justify-between items-center">
                  <span className="text-lg text-wrap w-[33%] text-center leading-none">{t("ui.score")}</span>
                  <ToggleSwitch value={manager.settings.modOnTop} width={50} borderColor="black" onColor="mediumpurple" offColor="mediumpurple" callback={() => manager.updateSetting("modOnTop", !manager.settings.modOnTop)} />
                  <span className="text-lg text-wrap w-[33%] text-center leading-none">{t("ui.mod")}</span>
                </div>
              </div>
              <Divider className="border-white mb-2 mt-2" />
              <div className="flex w-full flex-col items-center text-white">
                <label className="text-lg">{t("ui.style")}</label>
                <select className="bg-white text-black" value={manager.settings.style} onChange={(e) => manager.updateSetting("style", e.target.value)}>
                  <option value="Standard">
                    {t("ui.standard")}
                  </option>
                  <option value="5e">
                    {t("ui.5e")}
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}
        <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={(e) => handleImport(e.target.files)}/>
        <a ref={exportRef} className="hidden"/>
        {modalOpen &&
          <CharactersModal closeCallback={() => setModalOpen(false)}/> 
        }
      </div>
    </Modal>
  );
}
