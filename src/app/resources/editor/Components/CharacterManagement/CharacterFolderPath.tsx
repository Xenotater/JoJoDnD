"use client";

import { BsArrowLeftCircle } from "react-icons/bs";
import { useCharacterManager } from "./CharacterManagementContext";

export default function CharacterFolderPath() {
  const manager = useCharacterManager();
  const folders = manager.settings.folderPath;

  const navigate = (index: number) => {
    const newPath = [];
    for (let i = 0; i <= index; i++) {
      newPath.push(folders[i]);
    }
    manager.updateSetting("folderPath", newPath);
  }

  return (
    <div className="w-full flex gap-2 justify-center items-center mb-2">
      <BsArrowLeftCircle className="cursor-pointer hover:text-[25px] hover:mr-[-1px]" onClick={() => navigate(folders.length - 2)}/>
      <div>
        {folders.map((f,i) => (
          <span key={`folder-${f.id}`}>
            {i + 1 < folders.length ?
            <>
              <a onClick={() => navigate(i)}>{f.name}</a>
              /
            </>
            : <span>{f.name}</span>
            }
          </span>
        ))}
      </div>
    </div>
  );
}