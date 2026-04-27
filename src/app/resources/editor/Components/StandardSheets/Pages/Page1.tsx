"use client";

import {CharacterData} from "@/app/Models/Characters.model";
import Image from "next/image";
import InputWrapper from "../Components/InputWrapper";
import ScalingInput from "@/app/Components/Layout/ScalingInput/ScalingInput";

import styles from "../StandardSheets.module.css";
import SkillsAndSavesBox from "../Components/SkillsAndSavesBox";

export default function StandardPage1({data, updateField}: {data: Partial<CharacterData>; updateField: (name: string, value: unknown) => void}) {
  const characterClasses = ["Power", "Ranged", "Remote", "Ability", "Enhancement", "Revenge", "Independent", "Hive", "Act", "Ripple", "Spin", "Artisan", "Assassin", "Consul", "Heavyweight", "Ranger", "Scholar", "Warrior", "Other/Multiclass"];

  return (
    <div className="w-[8.5in] h-[11in] border-2 bg-white p-[32px]">
      <div className="flex justify-between items-end border-b-2 mb-[16px]">
        <Image className="mb-2" src="/images/logo/icon.webp" loading="eager" alt="icon" width={144} height={60} />
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
                <option key={c} value={c}>
                  {c}
                </option>
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
        <div className="col-span-6 row-span-2 min-w-0">
          <SkillsAndSavesBox data={data} updateField={updateField} />
        </div>
        <InputWrapper label="Armor Class" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.ac} onChange={(e) => updateField("ac", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Hit Dice" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.hdice} onChange={(e) => updateField("hdice", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Movement Speed" className="col-span-2 min-w-0">
          <div className={`${styles.bigInput} flex p-0`}>
            <div className="border-r w-1/2 h-full">
              <ScalingInput className="border-0 bg-white w-full h-full text-center flex items-center justify-center" fontmax={24} value={data.pspeed} onChange={(e) => updateField("pspeed", e.target.value)} />
            </div>
            <div className="border-l w-1/2 h-full">
              <ScalingInput className="border-0 bg-white w-full h-full text-center flex items-center justify-center" fontmax={24} value={data.sspeed} onChange={(e) => updateField("sspeed", e.target.value)} />
            </div>
          </div>
        </InputWrapper>
        <InputWrapper label="Stand AC" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.sac} onChange={(e) => updateField("sac", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Initiative" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.init} onChange={(e) => updateField("init", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Passive Perception" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.percep} onChange={(e) => updateField("percep", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Strength" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["str-mod"]} onChange={(e) => updateField("str-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["str-score"]} onChange={(e) => updateField("str-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Dexterity" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["dex-mod"]} onChange={(e) => updateField("dex-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["dex-score"]} onChange={(e) => updateField("dex-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Constitution" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["con-mod"]} onChange={(e) => updateField("con-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["con-score"]} onChange={(e) => updateField("con-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Intelligence" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["int-mod"]} onChange={(e) => updateField("int-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["int-score"]} onChange={(e) => updateField("int-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Wisdom" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["wis-mod"]} onChange={(e) => updateField("wis-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["wis-score"]} onChange={(e) => updateField("wis-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Charisma" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["cha-mod"]} onChange={(e) => updateField("cha-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["cha-score"]} onChange={(e) => updateField("cha-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Power" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Sstr-mod"]} onChange={(e) => updateField("Sstr-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Sstr-score"]} onChange={(e) => updateField("Sstr-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Precision" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Sdex-mod"]} onChange={(e) => updateField("Sdex-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Sdex-score"]} onChange={(e) => updateField("Sdex-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Durability" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Scon-mod"]} onChange={(e) => updateField("Scon-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Scon-score"]} onChange={(e) => updateField("Scon-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Range" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Sint-mod"]} onChange={(e) => updateField("Sint-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Sint-score"]} onChange={(e) => updateField("Sint-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Speed" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Swis-mod"]} onChange={(e) => updateField("Swis-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Swis-score"]} onChange={(e) => updateField("Swis-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Stand Energy" className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Scha-mod"]} onChange={(e) => updateField("Scha-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Scha-score"]} onChange={(e) => updateField("Scha-score", e.target.value)} />
        </InputWrapper>
        <div className="col-span-6 flex text-sm">
          <div className="w-[60%]">
            <p className="text-center">Class Features</p>
            <textarea className={`${styles.bigInput} h-[150px] text-xs text-left leading-3 p-1 resize-none`} value={data.classFeats} onChange={(e) => updateField("classFeats", e.target.value)} />
          </div>
          <div className="w-[40%]">
            <p className="text-center">Feats</p>
            <textarea className={`${styles.bigInput} h-[150px] border-l-0 text-xs text-left leading-3 p-1 resize-none`} value={data.otherFeats} onChange={(e) => updateField("otherFeats", e.target.value)} />
          </div>
        </div>
        <div className="col-span-6 row-span-2 flex text-sm">
          <div className="w-[60%]">
            <p className="text-center">Attacks & Actions</p>
            <div className="flex flex-col">
              <textarea className={`${styles.bigInput} h-[290px] text-xs text-left leading-3 p-1 resize-none`} value={data.atks1} onChange={(e) => updateField("atks1", e.target.value)} />
              <div className="flex justify-between border-2 border-t-0 px-1">
                <span>Attacks Per Round:</span>
                <input className="border-0 border-black border-b-1 bg-white w-[45px] h-[16px] p-0 text-center" value={data.atks} onChange={(e) => updateField("atks", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="w-[40%]">
            <p className="text-center">Inventory</p>
            <textarea className={`${styles.bigInput} h-[290px] border-l-0 text-xs text-left leading-3 p-1 resize-none`} value={data.inv} onChange={(e) => updateField("inv", e.target.value)} />
            <div className="flex justify-between border-2 border-t-0 border-l-0 px-1">
              <span>Inspiration:</span>
              <input className="border-0 border-black border-b-1 bg-white w-[45px] h-[16px] p-0 text-center" value={data.insp} onChange={(e) => updateField("insp", e.target.value)} />
            </div>
          </div>
        </div>
        <div className="col-span-6 text-sm">
          <p className="text-center">Languages & Other Proficiencies</p>
          <textarea className={`${styles.bigInput} h-[135px] text-xs text-left leading-3 p-1 resize-none`} value={data.otherProfs} onChange={(e) => updateField("otherProfs", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
