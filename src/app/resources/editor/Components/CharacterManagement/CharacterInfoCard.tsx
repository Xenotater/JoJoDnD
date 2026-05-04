"use client";

import { CharacterOrFolder } from "@/app/Models/Characters.model";

export default function CharacterInfoCard({data}: {data: CharacterOrFolder}) {
  return (
    <div className="h-[200px] w-[150px] border-2 text-base">
      <p>Name: {data.name}</p>
      <p>Type: {data.parent_id != undefined ? "Folder" : "Character"}</p>
    </div>
  )
}