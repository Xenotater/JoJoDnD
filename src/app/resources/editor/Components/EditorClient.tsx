"use client";

import {FaRegSave} from "react-icons/fa";
import EditorMenu from "./EditorMenu";
import {MdRedo, MdUndo} from "react-icons/md";
import {GrDocumentDownload} from "react-icons/gr";
import SheetForm from "./SheetForm";
import {useCharacterManager} from "./CharacterManagement/CharacterManagementContext";
import {Chart, RadialLinearScale, PointElement, LineElement, Tooltip, Filler} from "chart.js";
import {useLocale, useTranslations} from "next-intl";
import {doCaptureSheetImage, doCaptureSheetPDF, doSaveCharacterData, doUploadCharacterImage} from "@/app/Actions/editor.action";
import {base64ToFile, fileToFormData} from "@/app/Utilities/misc.utility";
import {useRef, useState} from "react";
import Select from "@/app/Components/Layout/Forms/Controlled/Select";

export default function EditorClient() {
  const manager = useCharacterManager();
  const t = useTranslations("Editor");
  const locale = useLocale();
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const [downloadType, setDownloadType] = useState<"pdf" | "image">("pdf");

  Chart.register(RadialLinearScale, PointElement, LineElement, Tooltip, Filler);

  const handleSave = async () => {
    const char = manager.loadedCharacter;
    const newId = await doSaveCharacterData({...char, img: undefined, img2: undefined});
    manager.save({...char, id: newId}, false);
    if (char.img && /^data:/.test(char.img)) await doUploadCharacterImage(fileToFormData(base64ToFile(char.img, `${char.name}`)), newId);
    if (char.img2 && /^data:/.test(char.img2)) await doUploadCharacterImage(fileToFormData(base64ToFile(char.img2, `${char.name}_alt`)), newId, true);
  };

  const doDownloadPDF = async () => {
    const doc = await doCaptureSheetPDF(manager.loadedCharacter, locale);
    const blob = new Blob([doc as Uint8Array<ArrayBuffer>], {type: "application/pdf"});
    const url = window.URL.createObjectURL(blob);
    if (downloadRef.current) {
      const link = downloadRef.current;
      link.href = url;
      link.download = `${manager.loadedCharacter.name}.pdf`;
      link.click();
    }
  };

  const doDownloadImage = async () => {
    const data = await doCaptureSheetImage(manager.loadedCharacter, locale);
    const files = data.map((d) => Uint8Array.from(atob(d), (c) => c.charCodeAt(0)));
    const blobs = files.map((f) => new Blob([f as Uint8Array<ArrayBuffer>], {type: "image/jpeg"}));
    const urls = blobs.map((b) => window.URL.createObjectURL(b));
    if (downloadRef.current) {
      urls.forEach((url, i) => {
        const link = downloadRef.current!;
        link.href = url;
        link.download = `${manager.loadedCharacter.name}_page${i + 1}.jpeg`;
        link.click();
        return;
      });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between flex-wrap sm:flex-nowrap gap-2">
        <div className="flex gap-[2px] text-2xl w-full xs:max-w-[260px] h-[44px] justify-between shrink">
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
        <div className="flex flex-col gap-1 items-center md:mr-4 w-full sm:w-auto">
          <button className="w-full flex gap-2 items-center bg-gray-300 rounded border-2 py-1 text-3xl xs:text-2xl justify-center" onClick={downloadType == "pdf" ? doDownloadPDF : doDownloadImage}>
            <GrDocumentDownload />
            {t("ui.download")}
          </button>
          <label className="flex gap-2">
            File type:
            <Select className="bg-white" value={downloadType} onChange={(e) => setDownloadType(e.target.value as "pdf" | "image")}>
              <option value="pdf">PDF</option>
              <option value="image">Images</option>
            </Select>
          </label>
        </div>
      </div>
      <SheetForm />
      <a ref={downloadRef} className="hidden" />
    </div>
  );
}
