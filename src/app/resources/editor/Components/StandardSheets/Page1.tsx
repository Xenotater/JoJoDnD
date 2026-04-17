"use client";

import { CharacterData } from "@/app/Models/Characters.model";
import Image from "next/image";
import InputWrapper from "./Components/InputWrapper";
import ScalingInput from "@/app/Components/Layout/ScalingInput/ScalingInput";

import styles from "./StandardSheets.module.css";

export default function StandardPage1({data, updateField}: {data: Partial<CharacterData>, updateField: (name: string, value: unknown) => void}) {

  return (
    <div className="w-[8.5in] h-[11in] border-2 bg-white p-[32px]">
      <div className="flex justify-between items-end border-b-2 mb-[16px]">  
        <Image className="mb-2" src="/images/logo/icon.webp" alt="icon" width={144} height={60}/>
        <h2 className="font-[sans-serif] m-0 text-[40px]">JoJo&apos;s Bizarre Tabletop Game</h2>
      </div>
      <div className="w-full flex gap-[24px]">
        <InputWrapper label="Character Name" className="basis-1/2 min-w-0">
          <ScalingInput className={styles.bigInput} fontMax={24} value={data.name} onChange={(e) => updateField("name", e.target.value)}/>
        </InputWrapper>
        <InputWrapper label="Hit Point Max" className="basis-1/6 min-w-0">
          <ScalingInput className={styles.bigInput} fontMax={24} value={data.maxHP} onChange={(e) => updateField("maxHP", e.target.value)}/>
        </InputWrapper>
        <InputWrapper label="Current Hit Points" className="basis-1/3 min-w-0">
          <ScalingInput className={styles.bigInput} fontMax={24} value={data.hp} onChange={(e) => updateField("hp", e.target.value)}/>
        </InputWrapper>
      </div>
    </div>
  );
}