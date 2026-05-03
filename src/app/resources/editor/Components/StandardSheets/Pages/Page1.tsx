"use client";

import {CharacterData} from "@/app/Models/Characters.model";
import Image from "next/image";
import InputWrapper from "../Components/InputWrapper";
import ScalingInput from "@/app/Components/Layout/ScalingInput/ScalingInput";

import styles from "../StandardSheets.module.css";
import SkillsAndSavesBox from "../Components/SkillsAndSavesBox";
import {useTranslations} from "next-intl";

export default function StandardPage1({data, updateField}: {data: Partial<CharacterData>; updateField: (name: string, value: unknown) => void}) {
  const t = useTranslations("Editor");
  const characterClasses: Record<string, string> = {pow: "Power", rng: "Ranged", rmt: "Remote", abl: "Ability", enh: "Enhancement", rev: "Revenge", ind: "Independent", hive: "Hive", act: "Act", rip: "Ripple", spin: "Spin", art: "Artisan", ass: "Assassin", con: "Consul", heav: "Heavyweight", ran: "Ranger", sch: "Scholar", war: "Warrior", multi: "Other/Multiclass"};

  return (
    <div className="w-[8.5in] h-[11in] border-2 bg-white p-[32px]">
      <div className="flex justify-between items-end border-b-2 mb-[16px]">
        <Image className="mb-2" src="/images/logo/icon.webp" loading="eager" alt="icon" width={144} height={60} />
        <h2 className="font-[sans-serif] m-0 text-[40px]">{t("page1Title")}</h2>
      </div>
      <div className="w-full grid grid-cols-12 gap-x-[24px] gap-y-2">
        <InputWrapper label={t("name")} className="col-span-6 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.name} onChange={(e) => updateField("name", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("hpMax")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.maxHP} onChange={(e) => updateField("maxHP", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("currentHp")} className="col-span-4 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.hp} onChange={(e) => updateField("hp", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("race")} className="col-span-3 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.race} onChange={(e) => updateField("race", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("class")} className="col-span-3 min-w-0">
          <div className={`${styles.bigInput} flex p-0 relative`}>
            <select className="w-full h-full outline-0 shadow-none shrink-1 appearance-none pl-2 text-base" value={data.class} onChange={(e) => updateField("class", e.target.value)}>
              {Object.entries(characterClasses).map((c) => (
                <option key={c[0]} value={c[0]}>
                  {t("classes." + c[1])}
                </option>
              ))}
            </select>
            {data.class == "act" &&
              <input type="number" className="border-0 bg-white w-[30px] text-base absolute left-10 pl-0" defaultValue={1} min={1} max={4} value={data.selectedAct} onChange={(e) => updateField("selectedAct", e.target.value)} />
            }
            <ScalingInput className="border-0 bg-white w-[50px] shrink-0 border-l-2 border-black h-full flex items-center justify-center" fontmax={24} value={data.level} onChange={(e) => updateField("level", e.target.value)} />
          </div>
        </InputWrapper>
        <InputWrapper label={t("dr")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.reduction} onChange={(e) => updateField("reduction", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("sdc")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.dc} onChange={(e) => updateField("dc", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("death")} className="col-span-2 min-w-0">
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
        <InputWrapper label={t("ac")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.ac} onChange={(e) => updateField("ac", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("hDice")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.hdice} onChange={(e) => updateField("hdice", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("move")} className="col-span-2 min-w-0">
          <div className={`${styles.bigInput} flex p-0`}>
            <div className="border-r w-1/2 h-full">
              <ScalingInput className="border-0 bg-white w-full h-full text-center flex items-center justify-center" fontmax={24} value={data.pspeed} onChange={(e) => updateField("pspeed", e.target.value)} />
            </div>
            <div className="border-l w-1/2 h-full">
              <ScalingInput className="border-0 bg-white w-full h-full text-center flex items-center justify-center" fontmax={24} value={data.sspeed} onChange={(e) => updateField("sspeed", e.target.value)} />
            </div>
          </div>
        </InputWrapper>
        <InputWrapper label={t("sac")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.sac} onChange={(e) => updateField("sac", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("init")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.init} onChange={(e) => updateField("init", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("passive")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.percep} onChange={(e) => updateField("percep", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("strength")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["str-mod"]} onChange={(e) => updateField("str-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["str-score"]} onChange={(e) => updateField("str-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("dexterity")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["dex-mod"]} onChange={(e) => updateField("dex-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["dex-score"]} onChange={(e) => updateField("dex-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("constitution")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["con-mod"]} onChange={(e) => updateField("con-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["con-score"]} onChange={(e) => updateField("con-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("intelligence")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["int-mod"]} onChange={(e) => updateField("int-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["int-score"]} onChange={(e) => updateField("int-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("wisdom")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["wis-mod"]} onChange={(e) => updateField("wis-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["wis-score"]} onChange={(e) => updateField("wis-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("charisma")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["cha-mod"]} onChange={(e) => updateField("cha-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["cha-score"]} onChange={(e) => updateField("cha-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("power")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Sstr-mod"]} onChange={(e) => updateField("Sstr-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Sstr-score"]} onChange={(e) => updateField("Sstr-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("precision")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Sdex-mod"]} onChange={(e) => updateField("Sdex-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Sdex-score"]} onChange={(e) => updateField("Sdex-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("durability")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Scon-mod"]} onChange={(e) => updateField("Scon-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Scon-score"]} onChange={(e) => updateField("Scon-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("range")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Sint-mod"]} onChange={(e) => updateField("Sint-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Sint-score"]} onChange={(e) => updateField("Sint-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("speed")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Swis-mod"]} onChange={(e) => updateField("Swis-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Swis-score"]} onChange={(e) => updateField("Swis-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("standEnergy")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[50px] text-4xl`} fontmax={36} value={data["Scha-mod"]} onChange={(e) => updateField("Scha-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[30px] text-base`} fontmax={24} value={data["Scha-score"]} onChange={(e) => updateField("Scha-score", e.target.value)} />
        </InputWrapper>
        <div className="col-span-6 flex text-sm">
          <div className="w-[60%]">
            <p className="text-center">{t("classFeats")}</p>
            <textarea className={`${styles.bigInput} h-[150px] text-xs text-left leading-3 p-1 resize-none`} value={data.classFeats} onChange={(e) => updateField("classFeats", e.target.value)} />
          </div>
          <div className="w-[40%]">
            <p className="text-center">{t("feats")}</p>
            <textarea className={`${styles.bigInput} h-[150px] border-l-0 text-xs text-left leading-3 p-1 resize-none`} value={data.otherFeats} onChange={(e) => updateField("otherFeats", e.target.value)} />
          </div>
        </div>
        <div className="col-span-6 row-span-2 flex text-sm">
          <div className="w-[60%]">
            <p className="text-center">{t("attacks")}</p>
            <div className="flex flex-col">
              <textarea className={`${styles.bigInput} h-[290px] text-xs text-left leading-3 p-1 resize-none`} value={data.atks1} onChange={(e) => updateField("atks1", e.target.value)} />
              <div className="flex justify-between border-2 border-t-0 px-1">
                <span>{t("perRound")}</span>
                <input className="border-0 border-black border-b-1 bg-white w-[45px] h-[16px] p-0 text-center" value={data.atks} onChange={(e) => updateField("atks", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="w-[40%]">
            <p className="text-center">{t("inv")}</p>
            <textarea className={`${styles.bigInput} h-[290px] border-l-0 text-xs text-left leading-3 p-1 resize-none`} value={data.inv} onChange={(e) => updateField("inv", e.target.value)} />
            <div className="flex justify-between border-2 border-t-0 border-l-0 px-1">
              <span>{t("insp")}</span>
              <input className="border-0 border-black border-b-1 bg-white w-[45px] h-[16px] p-0 text-center" value={data.insp} onChange={(e) => updateField("insp", e.target.value)} />
            </div>
          </div>
        </div>
        <div className="col-span-6 text-sm">
          <p className="text-center">{t("otherProfs")}</p>
          <textarea className={`${styles.bigInput} h-[135px] text-xs text-left leading-3 p-1 resize-none`} value={data.otherProfs} onChange={(e) => updateField("otherProfs", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
