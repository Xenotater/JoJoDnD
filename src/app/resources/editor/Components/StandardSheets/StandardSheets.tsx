"use client";

import { CharacterData } from "@/app/Models/Characters.model";
import StandardPage1 from "./Pages/Page1";
import StandardPage2 from "./Pages/Page2";
import Divider from "@/app/Components/Layout/Divider/Divider";
import StandardPage3 from "./Pages/Page3";
import ActPage from "./Pages/ActPage";

export default function StandardSheets({data, updateField}: {data: Partial<CharacterData>, updateField: (name: string, value: unknown) => void}) {
  return (
    <div className="w-fit m-auto min-w-fit h-full flex flex-col font-[sans-serif]">
      <StandardPage1 data={data} updateField={updateField}/>
      <Divider className="w-full"/>
      <StandardPage2 data={data} updateField={updateField}/>
      {data.class == "act" &&
        <>
          <Divider className="w-full"/>
          <ActPage data={data} updateField={updateField}/>
        </>
      }
      <Divider className="w-full"/>
      <StandardPage3 data={data} updateField={updateField}/>
    </div>
  );
}