"use client";

import {FaRegSave} from "react-icons/fa";
import EditorMenu from "./EditorMenu";
import {MdRedo, MdUndo} from "react-icons/md";
import {GrDocumentDownload} from "react-icons/gr";
import SheetForm from "./SheetForm";
import {useCharacterManager} from "./CharacterManagementContext";

export default function EditorClient() {
  const manager = useCharacterManager();

  return (
    <div className="w-full">
      <div className="w-full flex justify-between flex-wrap xs:flex-nowrap gap-2 xs:gap-[1px]">
        <div className="flex gap-[1px] text-2xl w-full max-w-[260px] justify-between shrink">
          <EditorMenu />
          <button className="flex gap-2 items-center bg-gray-300 rounded border-2">
            <FaRegSave />
            Save
          </button>
          <button className="flex gap-2 items-center bg-gray-300 rounded border-2 disabled:bg-gray-400 disabled:hover:cursor-not-allowed" disabled={!manager.settings.allowUndo} onClick={() => manager.undo()}>
            <MdUndo />
          </button>
          <button className="flex gap-2 items-center bg-gray-300 rounded border-2 disabled:bg-gray-400 disabled:hover:cursor-not-allowed" disabled={!manager.settings.allowRedo} onClick={() => manager.redo()}>
            <MdRedo />
          </button>
        </div>
        <button className="flex gap-2 items-center bg-gray-300 rounded border-2 text-3xl xs:text-2xl mr-4 w-full xs:w-auto justify-center">
          Download
          <GrDocumentDownload />
        </button>
      </div>
      <SheetForm />
    </div>
  );
}
