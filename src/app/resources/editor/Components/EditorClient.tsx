"use client";

import { FaRegSave } from "react-icons/fa";
import EditorMenu from "./EditorMenu";
import { MdRedo, MdUndo } from "react-icons/md";
import { GrDocumentDownload } from "react-icons/gr";

export default function EditorClient() {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <div className="flex gap-2 text-2xl">
          <EditorMenu/>
          <button className="flex gap-2 items-center bg-gray-300 rounded border-2"><FaRegSave/>Save</button>
          <button className="flex gap-2 items-center bg-gray-300 rounded border-2"><MdUndo/></button>
          <button className="flex gap-2 items-center bg-gray-300 rounded border-2"><MdRedo/></button>
        </div>
        <button className="flex gap-2 items-center bg-gray-300 rounded border-2 text-2xl mr-4">Download<GrDocumentDownload/></button>
      </div>
      {/* Sheets Here */}
    </div>
  );
}