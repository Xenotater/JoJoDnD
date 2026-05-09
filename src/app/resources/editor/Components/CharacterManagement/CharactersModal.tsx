"use client";

import Divider from "@/app/Components/Layout/Divider/Divider";
import Modal from "@/app/Components/Layout/Modal/Modal";
import {useTranslations} from "next-intl";
import {BsArrowLeft, BsArrowRight, BsPlusSquare, BsX} from "react-icons/bs";
import {useEffect, useState} from "react";
import {doCountCharacterPages, doGetCharacters} from "@/app/Actions/editor.action";
import {CharacterOrFolder} from "@/app/Models/Characters.model";
import IconButton from "@/app/Components/Layout/IconButton/IconButton";
import CharacterInfoCard from "./CharacterInfoCard";
import {useCharacterManager} from "./CharacterManagementContext";
import LoadingSpinner from "@/app/Components/Layout/LoadingSpinner/LoadingSpinner";
import {useSession} from "next-auth/react";
import CharacterFolderPath from "./CharacterFolderPath";

export default function CharactersModal({closeCallback}: {closeCallback: () => void}) {
  const t = useTranslations("Editor.ui");
  const manager = useCharacterManager();
  const {data: session} = useSession();
  const [characters, setCharacters] = useState<CharacterOrFolder[]>([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const setCurrentPage = (page: number) => {
    manager.updateSetting("currentPage", page);
  };

  const updateStates = async () => {
    setLoading(true);

    const search = manager.settings.search;
    const currentPage = manager.settings.currentPage;
    const folder = manager.settings.folderPath.slice(-1)[0].id
    const count = (await doCountCharacterPages(search, folder)) ?? 1;

    let overwritePage = currentPage;
    if (currentPage > count) overwritePage = count;
    else if (currentPage < 1) overwritePage = 1;

    setCharacters((await doGetCharacters(currentPage, search ?? "", folder)) ?? []);
    manager.updateSetting("currentPage", overwritePage);
    setPages(count);

    setLoading(false);
  };

  useEffect(() => {
    updateStates();
  }, [manager.settings.search, manager.settings.currentPage, manager.settings.folderPath]);

  return (
    <Modal fullPage blur closeCallback={closeCallback}>
      <div className="content shadow-lg/80 h-[75%] w-[80%] flex flex-col">
        <div className="relative">
          <input type="search" placeholder={t("search")} className="bg-white border-1 px-2" value={manager.settings.search} onChange={(e) => manager.updateSetting("search", e.target.value)} />
          <BsX className="absolute top-[-16px] right-[-16px] text-red-800 text-[64px] hover:text-[72px] hover:top-[-20px] hover:right-[-20px] cursor-pointer" onClick={closeCallback} />
        </div>
        <Divider className="w-full" />
        <div className="h-[calc(100%-126px)] overflow-y-scroll">
          <h2 className="text-center mb-2">{t("greeting", {name: session?.user.name ?? ""})}</h2>
          {manager.settings.folderPath.length > 1 &&
            <CharacterFolderPath/>
          }
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-wrap gap-4 2xl:gap-12 justify-center pb-6">
              {characters.map((c) => {
                const prefix = c.parent_id != undefined ? "folder" : "character";
                return (
                  <div key={prefix + c.id} className="basis-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex justify-center">
                    <CharacterInfoCard data={c} closeCallback={closeCallback} />
                  </div>
                );
              })}
              <div className="basis-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex justify-center">
                <div className="w-[204px] h-[250px] border-2 rounded-sm flex justify-center items-center hover:shadow-lg/66 cursor-pointer" onClick={() => {
                  manager.new();
                  closeCallback();
                }}>
                  <BsPlusSquare size={50}/>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full">
          <Divider className="w-full mb-2" />
          <div className="flex items-center">
            {manager.settings.currentPage != 1 ? (
              <IconButton onClick={() => setCurrentPage(manager.settings.currentPage - 1)} className="bg-jj-purple-1 text-white">
                <BsArrowLeft size={20} />
              </IconButton>
            ) : (
              <div className="w-[36px]"></div>
            )}
            <span className="grow text-center text-xl">
              <input type="number" max={pages} min={1} value={manager.settings.currentPage} onChange={(e) => setCurrentPage(parseInt(e.target.value) ?? 1)} dir="rtl" className="w-min" />/{pages}
            </span>
            {manager.settings.currentPage < pages ? (
              <IconButton onClick={() => setCurrentPage(manager.settings.currentPage + 1)} className="bg-jj-purple-1 text-white">
                <BsArrowRight size={20} />
              </IconButton>
            ) : (
              <div className="w-[36px]"></div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
