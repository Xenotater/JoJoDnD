"use client";

import { CharacterData } from "@/app/Models/Characters.model";
import { useEffect, useState } from "react";
import { useCharacterManager } from "./CharacterManagementContext";
import StandardSheets from "./StandardSheets/StandardSheets";

export default function SheetForm() {
  const manager = useCharacterManager();
  const loaded = manager.loadedCharacter;
  const style = manager.settings.style;
  const [data, setData] = useState<Partial<CharacterData>>(loaded.data);

  useEffect(() => {
    setData(loaded.data);
  }, [loaded])

  const updateField = (name: string, value: unknown) => {
    const newData = {...data, [name]: value};
    setData(newData);
    manager.save({...loaded, data: newData as CharacterData})
  };
  
  return (
    <form className="w-full h-full m-2 mt-4">
      {style == "Standard" &&
        <StandardSheets data={data} updateField={updateField}/>
      }
    </form>
  );
}