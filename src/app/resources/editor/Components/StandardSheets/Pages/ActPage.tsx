"use client";

import {CharacterData} from "@/app/Models/Characters.model";
import InputWrapper from "../Components/InputWrapper";
import ScalingInput from "@/app/Components/Layout/Forms/ScalingInput/ScalingInput";

import styles from "../StandardSheets.module.css";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import StatArray from "../Components/StatArray";
import Textarea from "@/app/Components/Layout/Forms/Controlled/Textarea";
import Select from "@/app/Components/Layout/Forms/Controlled/Select";

export default function ActPage({data, updateField}: {data: Partial<CharacterData>; updateField: (name: string, value: unknown) => void}) {
  const t = useTranslations("Editor");
  const [stats, setStats] = useState<Record<string, number>[]>([]);

  useEffect(() => {
    const stats: Record<string, number>[] = [];
    Array.from({length: 4}).map((_, i) => {
      stats.push({
        Pow: parseInt(data[`act${i+1}-str-score` as keyof CharacterData] as string ?? "0"),
        Spd: parseInt(data[`act${i+1}-wis-score` as keyof CharacterData] as string ?? "0"),
        Rng: parseInt(data[`act${i+1}-int-score` as keyof CharacterData] as string ?? "0"),
        Dur: parseInt(data[`act${i+1}-con-score` as keyof CharacterData] as string ?? "0"),
        Pre: parseInt(data[`act${i+1}-dex-score` as keyof CharacterData] as string ?? "0"),
        Pot: parseInt(data[`act${i+1}-cha-score` as keyof CharacterData] as string ?? "0"),
      });
    });
    setStats(stats);
  }, [data]);

  return (
    <div className="w-[8.5in] h-[11in] border-2 bg-white p-[32px]">
      <div className="flex justify-center items-end border-b-2 mb-[16px]">
        <h2 className="font-[sans-serif] m-0 text-[38px]">{t("actTitle")}</h2>
      </div>
      <div className="w-full grid grid-cols-12 gap-x-[24px] gap-y-2">
        <InputWrapper label={t("abilities")} className="col-span-3 row-span-3 min-w-0">
          <Textarea className={`${styles.bigInput} h-[202px] text-xs text-left leading-3 p-1 resize-none`} value={data.act1AbilityInfo} onBlur={(e) => updateField("act1AbilityInfo", e.target.value)} />
        </InputWrapper>
        <div className="col-span-2">
          <h3 className="underline">{t("act1")}</h3>
        </div>
        <Select className="col-span-4 mt-2 px-2 border-2 appearance-none" value={data.act1Type ?? "long"} onBlur={(e) => updateField("act1Type", e.target.value)} >
          <option value="close">{t("actClose")}</option>
          <option value="long">{t("actLong")}</option>
          <option value="ability">{t("actAbility")}</option>
          <option value="remote">{t("actRemote")}</option>
        </Select>
        <InputWrapper label={t("array")} className="col-span-3 row-span-3 min-w-0">
          <div className="h-[202px] w-[170] border-2 flex items-center justify-center">
            {stats[0] &&
              <StatArray stats={stats[0]} />
            }
          </div>
        </InputWrapper>
        <InputWrapper label={t("power")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act1-str-mod"]} onBlur={(e) => updateField("act1-str-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act1-str-score"]} onBlur={(e) => updateField("act1-str-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("precision")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act1-dex-mod"]} onBlur={(e) => updateField("act1-dex-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act1-dex-score"]} onBlur={(e) => updateField("act1-dex-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("durability")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act1-con-mod"]} onBlur={(e) => updateField("act1-con-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act1-con-score"]} onBlur={(e) => updateField("act1-con-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("range")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act1-int-mod"]} onBlur={(e) => updateField("act1-int-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act1-int-score"]} onBlur={(e) => updateField("act1-int-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("speed")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act1-wis-mod"]} onBlur={(e) => updateField("act1-wis-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act1-wis-score"]} onBlur={(e) => updateField("act1-wis-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("standEnergy")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act1-cha-mod"]} onBlur={(e) => updateField("act1-cha-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act1-cha-score"]} onBlur={(e) => updateField("act1-cha-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("abilities")} className="col-span-3 row-span-3 min-w-0">
          <Textarea className={`${styles.bigInput} h-[202px] text-xs text-left leading-3 p-1 resize-none`} value={data.act2AbilityInfo} onBlur={(e) => updateField("act2AbilityInfo", e.target.value)} />
        </InputWrapper>
        <div className="col-span-2">
          <h3 className="underline">{t("act2")}</h3>
        </div>
        <Select className="col-span-4 mt-2 px-2 border-2 appearance-none" value={data.act2Type ?? "ability"} onBlur={(e) => updateField("act2Type", e.target.value)} >
          <option value="close">{t("actClose")}</option>
          <option value="long">{t("actLong")}</option>
          <option value="ability">{t("actAbility")}</option>
          <option value="remote">{t("actRemote")}</option>
        </Select>
        <InputWrapper label={t("array")} className="col-span-3 row-span-3 min-w-0">
          <div className="h-[202px] w-[170] border-2 flex items-center justify-center">
            {stats[1] &&
              <StatArray stats={stats[1]} />
            }
          </div>
        </InputWrapper>
        <InputWrapper label={t("power")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act2-str-mod"]} onBlur={(e) => updateField("act2-str-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act2-str-score"]} onBlur={(e) => updateField("act2-str-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("precision")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act2-dex-mod"]} onBlur={(e) => updateField("act2-dex-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act2-dex-score"]} onBlur={(e) => updateField("act2-dex-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("durability")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act2-con-mod"]} onBlur={(e) => updateField("act2-con-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act2-con-score"]} onBlur={(e) => updateField("act2-con-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("range")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act2-int-mod"]} onBlur={(e) => updateField("act2-int-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act2-int-score"]} onBlur={(e) => updateField("act2-int-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("speed")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act2-wis-mod"]} onBlur={(e) => updateField("act2-wis-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act2-wis-score"]} onBlur={(e) => updateField("act2-wis-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("standEnergy")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act2-cha-mod"]} onBlur={(e) => updateField("act2-cha-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act2-cha-score"]} onBlur={(e) => updateField("act2-cha-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("abilities")} className="col-span-3 row-span-3 min-w-0">
          <Textarea className={`${styles.bigInput} h-[202px] text-xs text-left leading-3 p-1 resize-none`} value={data.act3AbilityInfo} onBlur={(e) => updateField("act3AbilityInfo", e.target.value)} />
        </InputWrapper>
        <div className="col-span-2">
          <h3 className="underline">{t("act3")}</h3>
        </div>
        <Select className="col-span-4 mt-2 px-2 border-2 appearance-none" value={data.act3Type ?? "close"} onBlur={(e) => updateField("act3Type", e.target.value)} >
          <option value="close">{t("actClose")}</option>
          <option value="long">{t("actLong")}</option>
          <option value="ability">{t("actAbility")}</option>
          <option value="remote">{t("actRemote")}</option>
        </Select>
        <InputWrapper label={t("array")} className="col-span-3 row-span-3 min-w-0">
          <div className="h-[202px] w-[170] border-2 flex items-center justify-center">
            {stats[2] &&
              <StatArray stats={stats[2]} />
            }
          </div>
        </InputWrapper>
        <InputWrapper label={t("power")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act3-str-mod"]} onBlur={(e) => updateField("act3-str-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act3-str-score"]} onBlur={(e) => updateField("act3-str-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("precision")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act3-dex-mod"]} onBlur={(e) => updateField("act3-dex-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act3-dex-score"]} onBlur={(e) => updateField("act3-dex-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("durability")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act3-con-mod"]} onBlur={(e) => updateField("act3-con-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act3-con-score"]} onBlur={(e) => updateField("act3-con-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("range")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act3-int-mod"]} onBlur={(e) => updateField("act3-int-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act3-int-score"]} onBlur={(e) => updateField("act3-int-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("speed")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act3-wis-mod"]} onBlur={(e) => updateField("act3-wis-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act3-wis-score"]} onBlur={(e) => updateField("act3-wis-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("standEnergy")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act3-cha-mod"]} onBlur={(e) => updateField("act3-cha-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act3-cha-score"]} onBlur={(e) => updateField("act3-cha-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("abilities")} className="col-span-3 row-span-3 min-w-0">
          <Textarea className={`${styles.bigInput} h-[202px] text-xs text-left leading-3 p-1 resize-none`} value={data.act4AbilityInfo} onBlur={(e) => updateField("act4AbilityInfo", e.target.value)} />
        </InputWrapper>
        <div className="col-span-2">
          <h3 className="underline">{t("act4")}</h3>
        </div>
        <label className="col-span-4 flex gap-2 items-baseline">
        <span>{t("actBased")}</span>
        <Select className="mt-2 px-2 border-2 appearance-none grow py-[2px]" value={data.act4Base} onBlur={(e) => updateField("act4Base", e.target.value)} >
          <option value="act1">{t("act1")}</option>
          <option value="act2">{t("act2")}</option>
          <option value="act3">{t("act3")}</option>
        </Select>
        </label>
        <InputWrapper label={t("array")} className="col-span-3 row-span-3 min-w-0">
          <div className="h-[202px] w-[170] border-2 flex items-center justify-center">
            {stats[3] &&
              <StatArray stats={stats[3]} />
            }
          </div>
        </InputWrapper>
        <InputWrapper label={t("power")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act4-str-mod"]} onBlur={(e) => updateField("act4-str-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act4-str-score"]} onBlur={(e) => updateField("act4-str-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("precision")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act4-dex-mod"]} onBlur={(e) => updateField("act4-dex-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act4-dex-score"]} onBlur={(e) => updateField("act4-dex-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("durability")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act4-con-mod"]} onBlur={(e) => updateField("act4-con-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act4-con-score"]} onBlur={(e) => updateField("act4-con-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("range")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act4-int-mod"]} onBlur={(e) => updateField("act4-int-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act4-int-score"]} onBlur={(e) => updateField("act4-int-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("speed")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act4-wis-mod"]} onBlur={(e) => updateField("act4-wis-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act4-wis-score"]} onBlur={(e) => updateField("act4-wis-score", e.target.value)} />
        </InputWrapper>
        <InputWrapper label={t("standEnergy")} className="col-span-2 min-w-0">
          <ScalingInput className={`${styles.bigInput} h-[40px] text-[25px]`} fontmax={36} value={data["act4-cha-mod"]} onBlur={(e) => updateField("act4-cha-mod", e.target.value)} />
          <ScalingInput className={`${styles.bigInput} border-t-0 h-[25px] text-[16px]`} fontmax={24} value={data["act4-cha-score"]} onBlur={(e) => updateField("act4-cha-score", e.target.value)} />
        </InputWrapper>
      </div>
    </div>
  );
}
