"use client";

import {CharacterData} from "@/app/Models/Characters.model";
import Image from "next/image";
import InputWrapper from "./Components/InputWrapper";
import ScalingInput from "@/app/Components/Layout/ScalingInput/ScalingInput";

import styles from "./StandardSheets.module.css";
import { Textfit } from "react-textfit";

export default function StandardPage1({data, updateField}: {data: Partial<CharacterData>; updateField: (name: string, value: unknown) => void}) {
  const characterClasses = ["Power", "Ranged", "Remote", "Ability", "Enhancement", "Revenge", "Independent", "Hive", "Act", "Ripple", "Spin", "Artisan", "Assassin", "Consul", "Heavyweight", "Ranger", "Scholar", "Warrior", "Other/Multiclass"];

  return (
    <div className="w-[8.5in] h-[11in] border-2 bg-white p-[32px]">
      <div className="flex justify-between items-end border-b-2 mb-[16px]">
        <Image className="mb-2" src="/images/logo/icon.webp" alt="icon" width={144} height={60} />
        <h2 className="font-[sans-serif] m-0 text-[40px]">JoJo&apos;s Bizarre Tabletop Game</h2>
      </div>
      <div className="w-full grid grid-cols-12 gap-x-[24px] gap-y-2">
        <InputWrapper label="Character Name" className="col-span-6 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.name} onChange={(e) => updateField("name", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Hit Point Max" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.maxHP} onChange={(e) => updateField("maxHP", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Current Hit Points" className="col-span-4 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.hp} onChange={(e) => updateField("hp", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Race & Passion" className="col-span-3 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.race} onChange={(e) => updateField("race", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Class & Level" className="col-span-3 min-w-0">
          <div className={`${styles.bigInput} flex p-0`}>
            <select className="w-full h-full outline-0 shadow-none shrink-1 appearance-none pl-2 text-base" value={data.class} onChange={(e) => updateField("class", e.target.value)}>
              {characterClasses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ScalingInput className="border-0 bg-white w-[50px] shrink-0 border-l-2 border-black h-full flex items-center justify-center" fontmax={24} value={data.level} onChange={(e) => updateField("level", e.target.value)} />
          </div>
        </InputWrapper>
        <InputWrapper label="Damage Reduction" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.reduction} onChange={(e) => updateField("reduction", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Stand DC" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.dc} onChange={(e) => updateField("dc", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Death Saves" className="col-span-2 min-w-0">
          <div className={`${styles.bigInput} flex p-0`}>
            <div className="border-r flex flex-col justify-between w-1/2 h-full">
              <ScalingInput className="border-0 bg-white w-full h-[36px] text-center flex items-center justify-center" fontmax={24} value={data.won} onChange={(e) => updateField("won", e.target.value)} />
              <span className="text-xs">Won</span>
            </div>
            <div className="border-l flex flex-col justify-between w-1/2 h-full">
              <ScalingInput className="border-0 bg-white w-full h-[36px] text-center flex items-center justify-center" fontmax={24} value={data.lost} onChange={(e) => updateField("lost", e.target.value)} />
              <span className="text-xs">Lost</span>
            </div>
          </div>
        </InputWrapper>
      </div>
    </div>
  );
}
