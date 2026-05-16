"use client";

import {FaRegSave} from "react-icons/fa";
import EditorMenu from "./EditorMenu";
import {MdRedo, MdUndo} from "react-icons/md";
import {GrDocumentDownload} from "react-icons/gr";
import SheetForm from "./SheetForm";
import {useCharacterManager} from "./CharacterManagement/CharacterManagementContext";
import {Chart, RadialLinearScale, PointElement, LineElement, Tooltip, Filler} from "chart.js";
import {useLocale, useTranslations} from "next-intl";
import {doSaveCharacterData, doUploadCharacterImage, exportPdf} from "@/app/Actions/editor.action";
import {base64ToFile, fileToFormData} from "@/app/Utilities/misc.utility";
import { useRef } from "react";

export default function EditorClient() {
  const manager = useCharacterManager();
  const t = useTranslations("Editor");
  const locale = useLocale();
  const downloadRef = useRef<HTMLAnchorElement>(null);

  Chart.register(RadialLinearScale, PointElement, LineElement, Tooltip, Filler);

  const handleSave = async () => {
    const char = manager.loadedCharacter;
    const newId = await doSaveCharacterData({...char, img: undefined, img2: undefined});
    manager.save({...char, id: newId}, false);
    if (char.img && /^data:/.test(char.img)) await doUploadCharacterImage(fileToFormData(base64ToFile(char.img, `${char.name}`)), newId);
    if (char.img2 && /^data:/.test(char.img2)) await doUploadCharacterImage(fileToFormData(base64ToFile(char.img2, `${char.name}_alt`)), newId, true);
  };

  const doDownload = async () => {
    const doc = await exportPdf(manager.loadedCharacter, locale);
    const blob = new Blob([doc as Uint8Array<ArrayBuffer>], {type: "application/pdf"});
    const url = window.URL.createObjectURL(blob);
    if (downloadRef.current) {
      const link = downloadRef.current;
      link.href = url;
      link.download = `${manager.loadedCharacter.name}.pdf`;
      link.click();
    }
    //TODO: consider offering other file format options.
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between flex-wrap xs:flex-nowrap gap-2 xs:gap-[1px]">
        <div className="flex gap[1px] sm:gap-2 text-2xl w-full sm:max-w-[260px] justify-between shrink">
          <EditorMenu />
          <button className="flex gap-2 items-center bg-gray-300 grow max-w-[150px] text-3xl sm:text-2xl sm:grow-0 rounded border-2" onClick={handleSave}>
            <FaRegSave />
            {t("ui.save")}
          </button>
          <button className="flex gap-2 items-center bg-gray-300 rounded border-2 disabled:bg-gray-400 disabled:hover:cursor-not-allowed" disabled={!manager.settings.allowUndo} onClick={() => manager.undo()}>
            <MdUndo />
          </button>
          <button className="flex gap-2 items-center bg-gray-300 rounded border-2 disabled:bg-gray-400 disabled:hover:cursor-not-allowed" disabled={!manager.settings.allowRedo} onClick={() => manager.redo()}>
            <MdRedo />
          </button>
        </div>
        <button className="flex gap-2 items-center bg-gray-300 rounded border-2 py-1 text-3xl xs:text-2xl md:mr-4 w-full xs:w-auto justify-center" onClick={doDownload}>
          <GrDocumentDownload />
          {t("ui.download")}
        </button>
      </div>
      <SheetForm />
      <a ref={downloadRef} className="hidden"/>
    </div>
  );
}
