"use client";

import {CharacterData} from "@/app/Models/Characters.model";
import InputWrapper from "../Components/InputWrapper";
import ScalingInput from "@/app/Components/Layout/Forms/ScalingInput/ScalingInput";

import styles from "../StandardSheets.module.css";
import ImageInput from "../Components/ImageInput";
import StatArray from "../Components/StatArray";
import {useEffect, useState} from "react";
import {useCharacterManager} from "../../CharacterManagement/CharacterManagementContext";
import { useTranslations } from "next-intl";
import Textarea from "@/app/Components/Layout/Forms/Controlled/Textarea";
import { useSession } from "next-auth/react";

export default function StandardPage2({data, updateField}: {data: Partial<CharacterData>; updateField: (name: string, value: unknown) => void}) {
  const t = useTranslations("Editor");
  const manager = useCharacterManager();
  const {data: session} = useSession();
  const [stats, setStats] = useState<Record<string, number>>({});

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
        <h2 className="font-[sans-serif] m-0 text-[40px]">{t("page2Title")}</h2>
      </div>
      <div className="w-full grid grid-cols-12 gap-x-[24px] gap-y-2">
        <InputWrapper label={t("name")} className="col-span-6 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.Uname} onBlur={(e) => updateField("Uname", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("sName")} className="col-span-6 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.sName} onBlur={(e) => updateField("sName", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("headHp")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.headHP} onBlur={(e) => updateField("headHP", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("headAc")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.hac} onBlur={(e) => updateField("hac", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("energy")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.energy} onBlur={(e) => updateField("energy", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("altLevel")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.Ulevel} onBlur={(e) => updateField("Ulevel", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("shp")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.standHP} onBlur={(e) => updateField("standHP", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("currentSe")} className="col-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.cse} onBlur={(e) => updateField("cse", e.target.value)} />
        </InputWrapper>
        <div className="col-span-6 min-w-0">
          <p className="text-sm text-center">{t("altImage")}</p>
          <div className="h-[250px] w-[360px] border-2">
            <ImageInput
              img={manager.loadedCharacter.img2 ?? ""}
              alt="Alternate Character Image"
              update={(img: string) => {
                updateField("img2", img);
              }}
            />
          </div>
        </div>
        <InputWrapper label={t("array")} className="col-span-6 min-w-0">
          <div className="h-[250px] w-[360] border-2 flex items-center justify-center">
            <StatArray stats={stats} />
          </div>
        </InputWrapper>
        <InputWrapper label={t("abilities")} className="col-span-12 min-w-0">
          <Textarea className={`${styles.bigInput} h-[250px] text-xs text-left leading-3 p-1 resize-none`} value={data.Uatks} onBlur={(e) => updateField("Uatks", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("minions")} className="col-span-6 min-w-0">
          <Textarea className={`${styles.bigInput} h-[168px] text-xs text-left leading-3 p-1 resize-none`} value={data.minions} onBlur={(e) => updateField("minions", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("other")} className="col-span-6 min-w-0">
          <Textarea className={`${styles.bigInput} h-[168px] text-xs text-left leading-3 p-1 resize-none`} value={data.Ufeats} onBlur={(e) => updateField("Ufeats", e.target.value)} />
        </InputWrapper>
      </div>
    </div>
  );
}
