"use client";

import { CharacterData } from "@/app/Models/Characters.model";

export default function StandardPage1({data, updateField}: {data: Partial<CharacterData>, updateField: (name: string, value: unknown) => void}) {

  return (
    <div>
      <input value={data.name} onChange={(e) => updateField("name", e.target.value)}/>
    </div>
  );
}