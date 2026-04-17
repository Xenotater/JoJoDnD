"use client";

import { CharacterData } from "@/app/Models/Characters.model";
import StandardPage1 from "./Page1";

export default function StandardSheets({data, updateField}: {data: Partial<CharacterData>, updateField: (name: string, value: unknown) => void}) {
  return (
    <div className="w-full min-w-fit h-full flex justify-center font-[sans-serif]">
      <StandardPage1 data={data} updateField={updateField}/>
    </div>
  );
}