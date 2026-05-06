"use client";

import {CharacterData} from "@/app/Models/Characters.model";
import InputWrapper from "../Components/InputWrapper";
import ScalingInput from "@/app/Components/Layout/Forms/ScalingInput/ScalingInput";

import styles from "../StandardSheets.module.css";
import ImageInput from "../Components/ImageInput";
import {useCharacterManager} from "../../CharacterManagement/CharacterManagementContext";
import { useTranslations } from "next-intl";
import Textarea from "@/app/Components/Layout/Forms/Controlled/Textarea";

export default function StandardPage3({data, updateField}: {data: Partial<CharacterData>; updateField: (name: string, value: unknown) => void}) {
  const t = useTranslations("Editor");
  const manager = useCharacterManager();

  return (
    <div className="w-[8.5in] h-[11in] border-2 bg-white p-[32px]">
      <div className="flex justify-center items-end border-b-2 mb-[16px]">
        <h2 className="font-[sans-serif] m-0 text-[40px]">{t("page3Title")}</h2>
      </div>
      <div className="w-full grid grid-cols-12 gap-x-[24px] gap-y-2">
        <div className="col-span-6 row-span-3 min-w-0">
          <p className="text-sm text-center">{t("image")}</p>
          <div className="h-[360px] w-[360px] border-2">
            <ImageInput
              img={manager.loadedCharacter.img ?? ""}
              update={(img: string) => {
                updateField("img", img);
              }}
            />
          </div>
        </div>
        <InputWrapper label={t("name")} className="col-span-6 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.name} onBlur={(e) => updateField("name", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("back")} className="col-span-6 min-w-0">
          <Textarea className={`${styles.bigInput} h-[144px] text-xs text-left leading-3 p-1 resize-none`} value={data.back} onBlur={(e) => updateField("back", e.target.value)} />
        </InputWrapper>
        <div className="col-span-6 min-w-0 flex">
          <div className="w-1/2">
            <p className="text-sm text-center">{t("ideal")}</p>
            <Textarea className={`${styles.bigInput} h-[100px] text-xs text-left leading-3 p-1 resize-none`} value={data.ideals} onBlur={(e) => updateField("ideals", e.target.value)} />
          </div>
          <div className="w-1/2">
            <p className="text-sm text-center">{t("flaw")}</p>
            <Textarea className={`${styles.bigInput} border-l-0 h-[100px] text-xs text-left leading-3 p-1 resize-none`} value={data.ideals} onBlur={(e) => updateField("ideals", e.target.value)} />
          </div>
        </div>
        <InputWrapper label={t("weight")} className="col-span-2 row-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.weight} onBlur={(e) => updateField("weight", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("height")} className="col-span-2 row-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.height} onBlur={(e) => updateField("height", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("age")} className="col-span-2 row-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.age} onBlur={(e) => updateField("age", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("person")} className="col-span-6 row-span-3 min-w-0">
          <Textarea className={`${styles.bigInput} h-[104px] text-xs text-left leading-3 p-1 resize-none`} value={data.person} onBlur={(e) => updateField("person", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("hair")} className="col-span-2 row-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.hair} onBlur={(e) => updateField("hair", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("skin")} className="col-span-2 row-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.skin} onBlur={(e) => updateField("skin", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("eye")} className="col-span-2 row-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.eye} onBlur={(e) => updateField("eye", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("relate")} className="col-span-6 row-span-3 min-w-0">
          <Textarea className={`${styles.bigInput} h-[104px] text-xs text-left leading-3 p-1 resize-none`} value={data.relate} onBlur={(e) => updateField("relate", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("voice")} className="col-span-6 row-span-2 min-w-0">
          <ScalingInput className={styles.bigInput} fontmax={24} value={data.voice} onBlur={(e) => updateField("voice", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("info")} className="col-span-12 min-w-0">
          <Textarea className={`${styles.bigInput} h-[250px] text-xs text-left leading-3 p-1 resize-none`} value={data.info} onBlur={(e) => updateField("info", e.target.value)} />
        </InputWrapper>
      </div>
    </div>
  );
}
