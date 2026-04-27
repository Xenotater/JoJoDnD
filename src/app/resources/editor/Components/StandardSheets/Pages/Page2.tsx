"use client";

import {CharacterData} from "@/app/Models/Characters.model";
import InputWrapper from "../Components/InputWrapper";
import ScalingInput from "@/app/Components/Layout/ScalingInput/ScalingInput";

import styles from "../StandardSheets.module.css";
import ImageInput from "../Components/ImageInput";
import StatArray from "../Components/StatArray";
import {useEffect, useState} from "react";
import {useCharacterManager} from "../../CharacterManagementContext";

export default function StandardPage2({data, updateField}: {data: Partial<CharacterData>; updateField: (name: string, value: unknown) => void}) {
  const [stats, setStats] = useState<Record<string, number>>({});
  const manager = useCharacterManager();

  useEffect(() => {
    setStats({
      Power: parseInt(data["Sstr-score"] ?? "0"),
      Speed: parseInt(data["Swis-score"] ?? "0"),
      Range: parseInt(data["Sint-score"] ?? "0"),
      Durability: parseInt(data["Scon-score"] ?? "0"),
      Precision: parseInt(data["Sdex-score"] ?? "0"),
      Potential: parseInt(data["Scha-score"] ?? "0"),
    });
  }, [data]);

  return (
    <div className="w-[8.5in] h-[11in] border-2 bg-white p-[32px]">
      <div className="flex justify-center items-end border-b-2 mb-[16px]">
        <h2 className="font-[sans-serif] m-0 text-[40px]">JJBTG Ability Sheet</h2>
      </div>
      <div className="w-full grid grid-cols-12 gap-x-[24px] gap-y-2">
        <InputWrapper label="Character Name" className="col-span-6 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.Uname} onChange={(e) => updateField("Uname", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Stand Name" className="col-span-6 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.sName} onChange={(e) => updateField("sName", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Head HP" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.headHP} onChange={(e) => updateField("headHP", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Head AC" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.hac} onChange={(e) => updateField("hac", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Energy" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.energy} onChange={(e) => updateField("energy", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Alt. Level" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.Ulevel} onChange={(e) => updateField("Ulevel", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Stand HP" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.standHP} onChange={(e) => updateField("standHP", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Current SE" className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.cse} onChange={(e) => updateField("cse", e.target.value)} />
        </InputWrapper>
        <div className="col-span-6 min-w-0">
          <p className="text-sm text-center">Stand/Alt. Image</p>
          <div className="h-[250px] w-[360px] border-2">
            <ImageInput
              img={manager.loadedCharacter.img2 ?? ""}
              update={(img: string) => {
                updateField("img2", img);
              }}
            />
          </div>
        </div>
        <InputWrapper label="Stat Array" className="col-span-6 min-w-0">
          <div className="h-[250px] w-[360] border-2 flex items-center justify-center">
            <StatArray stats={stats} />
          </div>
        </InputWrapper>
        <InputWrapper label="Ability Info" className="col-span-12 min-w-0">
          <textarea className={`${styles.bigInput} h-[250px] text-xs text-left leading-3 p-1 resize-none`} value={data.Uatks} onChange={(e) => updateField("Uatks", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Minions / Equipment" className="col-span-6 min-w-0">
          <textarea className={`${styles.bigInput} h-[168px] text-xs text-left leading-3 p-1 resize-none`} value={data.minions} onChange={(e) => updateField("minions", e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Other Notes and Features" className="col-span-6 min-w-0">
          <textarea className={`${styles.bigInput} h-[168px] text-xs text-left leading-3 p-1 resize-none`} value={data.Ufeats} onChange={(e) => updateField("Ufeats", e.target.value)} />
        </InputWrapper>
      </div>
    </div>
  );
}
