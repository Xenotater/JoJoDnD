"use client";

import { CharacterData } from "@/app/Models/Characters.model";
import StandardPage1 from "./Page1";

export default function StandardSheets({data, updateField}: {data: Partial<CharacterData>, updateField: (name: string, value: unknown) => void}) {
  return (
    <div>
      <StandardPage1 data={data} updateField={updateField}/>
    </div>
  );
}