"use client";

import Divider from "@/app/Components/Layout/Divider/Divider";
import IconButton from "@/app/Components/Layout/IconButton/IconButton";
import Modal from "@/app/Components/Layout/Modal/Modal";
import Link from "next/link";
import {useRef, useState} from "react";
import {BsList, BsPerson} from "react-icons/bs";
import {HiOutlineUserGroup} from "react-icons/hi";
import {useCharacterManager} from "./CharacterManagementContext";
import {TbFileExport, TbFileImport} from "react-icons/tb";
import ToggleSwitch from "@/app/Components/Layout/ToggleSwitch/ToggleSwitch";
import { useAuth } from "@/app/Components/Auth/AuthContextProvider";
import { Character, CharacterData } from "@/app/Models/Characters.model";
import { useSession } from "next-auth/react";

//TODO: will a context be needed for current resource state?
export default function EditorMenu() {
  const {data: session} = useSession();
  const auth = useAuth();
  const manager = useCharacterManager();
  const [menuOpen, setMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const exportRef = useRef<HTMLAnchorElement>(null);

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
        const form = JSON.parse(data.form).reduce(
          (obj: CharacterData, item: {name: string, value: string}) => ({[item.name]: item.value, ...obj}), {}
        ) as CharacterData;
        manager.load({
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
      const formData = Object.keys(char.data).map((k) => ({name: k, value: char.data[k as keyof CharacterData]}))
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
                <span>Account</span>
              </Link>
              <Divider className="border-white mb-2 mt-2" />
              <Link href="/resources/community/manage" onClick={() => toggleMenu(false)} className="flex gap-2 text-white items-center hover:underline">
                <HiOutlineUserGroup size={24} />
                <span>Characters</span>
              </Link>
              <Divider className="border-white mb-2 mt-2" />
              <Link href="" onClick={() => {if (importRef.current) importRef.current.click()}} className="flex gap-2 text-white items-center hover:underline">
                <TbFileImport size={24} />
                <span>Import Data</span>
              </Link>
              <Divider className="border-white mb-2 mt-2" />
              <Link href="" onClick={() => handleExport()} className="flex gap-2 text-white items-center hover:underline">
                <TbFileExport size={24} />
                <span>Export Data</span>
              </Link>
              <Divider className="border-white mb-2 mt-2" />
              <div className="flex w-full flex-col items-center text-white">
                <label className="text-lg">Autofill</label>
                <div className="flex w-full justify-center items-center">
                  <span className="text-lg">off</span>
                  <ToggleSwitch value={manager.settings.autofill} width={50} borderColor="black" onColor="mediumpurple" callback={() => manager.toggleAutofill()} className="mx-4"/>
                  <span className="text-lg">on</span>
                </div>
              </div>
              <Divider className="border-white mb-2 mt-2" />
              <div className="flex w-full flex-col items-center text-white">
                <label className="text-lg">Stats</label>
                <div className="flex w-full justify-between items-center">
                  <span className="text-lg text-wrap w-[33%] text-center leading-none">score on top</span>
                  <ToggleSwitch value={manager.settings.modOnTop} width={50} borderColor="black" onColor="mediumpurple" offColor="mediumpurple" callback={() => manager.toggleStatPos()} />
                  <span className="text-lg text-wrap w-[33%] text-center leading-none">mod on top</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={(e) => handleImport(e.target.files)}/>
        <a ref={exportRef} className="hidden"/>
      </div>
    </Modal>
  );
}
