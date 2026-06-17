"use client";

import { CharacterData } from "@/app/Models/Characters.model";
import ProficiencySelect from "./ProficiencySelect";
import { useTranslations } from "next-intl";
import Input from "@/app/Components/Layout/Forms/Controlled/Input";

export default function SkillsAndSavesBox({data, updateField}: {data: Partial<CharacterData>; updateField: (name: string, value: unknown) => void}) {
  const t = useTranslations("Editor");
  const bonusProfs = 3 + parseInt(data.bonus ?? "0") + parseInt(data["int-mod"]?.replace(/[+-]/, "") ?? "0");


  return (
    <div className="w-full h-full flex">
      <div className="w-[21%]">
        <p className="text-sm text-center">{t("saves")}</p>
        <div className="w-full h-[calc(100%-20px)] border-2">
          <div className="pt-0.5 text-sm">
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">{t("str")}</span>
              <ProficiencySelect name="ath" value={data["str-save"]} onChange={(e) => updateField("str-save", e.target.value)}/>
              <Input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["str-bonus"]} onBlur={(e) => updateField("str-bonus", e.target.value)}/>
            </label>
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">{t("dex")}</span>
              <ProficiencySelect name="ath" value={data["dex-save"]} onChange={(e) => updateField("dex-save", e.target.value)}/>
              <Input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["dex-bonus"]} onBlur={(e) => updateField("dex-bonus", e.target.value)}/>
            </label>
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">{t("con")}</span>
              <ProficiencySelect name="ath" value={data["con-save"]} onChange={(e) => updateField("con-save", e.target.value)}/>
              <Input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["con-bonus"]} onBlur={(e) => updateField("con-bonus", e.target.value)}/>
            </label>
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">{t("int")}</span>
              <ProficiencySelect name="ath" value={data["int-save"]} onChange={(e) => updateField("int-save", e.target.value)}/>
              <Input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["int-bonus"]} onBlur={(e) => updateField("int-bonus", e.target.value)}/>
            </label>
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">{t("wis")}</span>
              <ProficiencySelect name="ath" value={data["wis-save"]} onChange={(e) => updateField("wis-save", e.target.value)}/>
              <Input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["wis-bonus"]} onBlur={(e) => updateField("wis-bonus", e.target.value)}/>
            </label>
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">{t("cha")}</span>
              <ProficiencySelect name="ath" value={data["cha-save"]} onChange={(e) => updateField("cha-save", e.target.value)}/>
              <Input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["cha-bonus"]} onBlur={(e) => updateField("cha-bonus", e.target.value)}/>
            </label>
          </div>
          <div className="border-t-2">
            <label className="text-sm flex justify-center items-center gap-2">
              <span>{t("pb")}</span>
              <Input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data.bonus} onBlur={(e) => updateField("bonus", e.target.value)}/>
            </label>
          </div>
        </div>
      </div>
      <div className="w-[79%]">
        <p className="text-sm text-center">
          {t("skills")}{" "}
          {!isNaN(bonusProfs) &&
            <span>(+{bonusProfs})</span>
          }
        </p>
        <div className="w-full h-[calc(100%-20px)] border-2 border-l-0 p-[3px] text-[11px] flex gap-1">
          <div className="w-1/2 flex flex-col gap-[1px]">
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="acro" value={data.acro} onChange={(e) => updateField("acro", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["acro-bonus"]} onBlur={(e) => updateField("acro-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("acrobatics")}  <small>{t("skillStats.dex")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="ath" value={data.ath} onChange={(e) => updateField("ath", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ath-bonus"]} onBlur={(e) => updateField("ath-bonus", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ath-bonus2"]} onBlur={(e) => updateField("ath-bonus2", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("athletics")}  <small>{t("skillStats.str-wis")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="bluff" value={data.dec} onChange={(e) => updateField("dec", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["dec-bonus"]} onBlur={(e) => updateField("dec-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("bluff")}  <small>{t("skillStats.cha")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="care" value={data.ani} onChange={(e) => updateField("ani", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ani-bonus"]} onBlur={(e) => updateField("ani-bonus", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ani-bonus2"]} onBlur={(e) => updateField("ani-bonus2", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("care")}  <small>{t("skillStats.wis-cha")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="diplo" value={data.pers} onChange={(e) => updateField("pers", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["pers-bonus"]} onBlur={(e) => updateField("pers-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("diplomacy")}  <small>{t("skillStats.cha")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="finesse" value={data.sli} onChange={(e) => updateField("sli", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["sli-bonus"]} onBlur={(e) => updateField("sli-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("finesse")}  <small>{t("skillStats.dex")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="grit" value={data.grit} onChange={(e) => updateField("grit", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["grit-bonus"]} onBlur={(e) => updateField("grit-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("grit")}  <small>{t("skillStats.con")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="intimid" value={data.intim} onChange={(e) => updateField("intim", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["intim-bonus0"]} onBlur={(e) => updateField("intim-bonus0", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["intim-bonus"]} onBlur={(e) => updateField("intim-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("intimidate")}  <small>{t("skillStats.str-cha")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="invest" value={data.invest} onChange={(e) => updateField("invest", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["invest-bonus"]} onBlur={(e) => updateField("invest-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("investigation")}  <small>{t("skillStats.int")}</small></p>
            </label>
          </div>
          <div className="w-1/2 flex flex-col gap-[1px]">
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="know" value={data.his} onChange={(e) => updateField("his", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["his-bonus"]} onBlur={(e) => updateField("his-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("knowledge")}  <small>{t("skillStats.int")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="medic" value={data.medi} onChange={(e) => updateField("medi", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["medi-bonus0"]} onBlur={(e) => updateField("medi-bonus0", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["medi-bonus"]} onBlur={(e) => updateField("medi-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("medicine")}  <small>{t("skillStats.int-wis")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="percept" value={data.perc} onChange={(e) => updateField("perc", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["perc-bonus"]} onBlur={(e) => updateField("perc-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("perception")}  <small>{t("skillStats.wis")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="pres" value={data.perf} onChange={(e) => updateField("ani", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["perf-bonus"]} onBlur={(e) => updateField("perf-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("presence")}  <small>{t("skillStats.cha")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="science" value={data.sci} onChange={(e) => updateField("sci", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["sci-bonus"]} onBlur={(e) => updateField("sci-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("science")}  <small>{t("skillStats.int")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="sneak" value={data.steal} onChange={(e) => updateField("steal", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["steal-bonus"]} onBlur={(e) => updateField("steal-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("sneak")}  <small>{t("skillStats.dex")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="super" value={data.arc} onChange={(e) => updateField("arc", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["arc-bonus"]} onBlur={(e) => updateField("arc-bonus", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["arc-bonus2"]} onBlur={(e) => updateField("arc2-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("supernatural")}  <small>{t("skillStats.int-wis")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="surviv" value={data.surv} onChange={(e) => updateField("surv", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["surv-bonus0"]} onBlur={(e) => updateField("surv-bonus0", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["surv-bonus"]} onBlur={(e) => updateField("surv-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("survival")}  <small>{t("skillStats.int-wis")}</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="vibe" value={data.ins} onChange={(e) => updateField("ins", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ins-bonus"]} onBlur={(e) => updateField("ins-bonus", e.target.value)}/>
                <Input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ins-bonus2"]} onBlur={(e) => updateField("ins-bonus2", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">{t("vibe")}  <small>{t("skillStats.wis-cha")}</small></p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}