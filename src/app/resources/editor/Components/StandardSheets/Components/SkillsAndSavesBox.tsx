"use client";

import { CharacterData } from "@/app/Models/Characters.model";
import ProficiencySelect from "./ProficiencySelect";

export default function SkillsAndSavesBox({data, updateField}: {data: Partial<CharacterData>; updateField: (name: string, value: unknown) => void}) {
  const bonusProfs = 3 + parseInt(data.bonus ?? "0") + parseInt(data["int-mod"]?.replace(/[+-]/, "") ?? "0");


  return (
    <div className="w-full h-full grid grid-cols-5">
      <div>
        <p className="text-sm text-center">Saves</p>
        <div className="w-full h-[calc(100%-20px)] border-2">
          <div className="pt-0.5 text-sm">
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">Str</span>
              <input type="checkbox" checked={data["str-save"] == "on"} onChange={(e) => updateField("str-save", e.target.checked ? "on" : undefined)}/>
              <input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["str-bonus"]} onChange={(e) => updateField("str-bonus", e.target.value)}/>
            </label>
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">Dex</span>
              <input type="checkbox" checked={data["dex-save"] == "on"} onChange={(e) => updateField("dex-save", e.target.checked ? "on" : undefined)}/>
              <input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["dex-bonus"]} onChange={(e) => updateField("dex-bonus", e.target.value)}/>
            </label>
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">Con</span>
              <input type="checkbox" checked={data["con-save"] == "on"} onChange={(e) => updateField("con-save", e.target.checked ? "on" : undefined)}/>
              <input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["con-bonus"]} onChange={(e) => updateField("con-bonus", e.target.value)}/>
            </label>
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">Int</span>
              <input type="checkbox" checked={data["int-save"] == "on"} onChange={(e) => updateField("int-save", e.target.checked ? "on" : undefined)}/>
              <input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["int-bonus"]} onChange={(e) => updateField("int-bonus", e.target.value)}/>
            </label>
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">Wis</span>
              <input type="checkbox" checked={data["wis-save"] == "on"} onChange={(e) => updateField("wis-save", e.target.checked ? "on" : undefined)}/>
              <input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["wis-bonus"]} onChange={(e) => updateField("wis-bonus", e.target.value)}/>
            </label>
            <label className="flex justify-between items-center px-0.5">
              <span className="w-[40%]">Cha</span>
              <input type="checkbox" checked={data["cha-save"] == "on"} onChange={(e) => updateField("cha-save", e.target.checked ? "on" : undefined)}/>
              <input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data["cha-bonus"]} onChange={(e) => updateField("cha-bonus", e.target.value)}/>
            </label>
          </div>
          <div className="border-t-2">
            <label className="text-sm flex justify-center items-center gap-2">
              PB:
              <input className="border-0 border-black border-b-1 bg-white w-[20px] h-[16px] p-0 text-center" value={data.bonus} onChange={(e) => updateField("bonus", e.target.value)}/>
            </label>
          </div>
        </div>
      </div>
      <div className="col-span-4">
        <p className="text-sm text-center">
          Skill Proficiencies
          {!isNaN(bonusProfs) &&
            <span>(+{bonusProfs})</span>
          }
        </p>
        <div className="w-full h-[calc(100%-20px)] border-2 border-l-0 p-[3px] text-[11px] flex gap-1">
          <div className="w-1/2 flex flex-col gap-[1px]">
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="acro" value={data.acro} onChange={(e) => updateField("acro", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["acro-bonus"]} onChange={(e) => updateField("acro-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Acro<small>(dex)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="ath" value={data.ath} onChange={(e) => updateField("ath", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ath-bonus"]} onChange={(e) => updateField("ath-bonus", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ath-bonus2"]} onChange={(e) => updateField("ath-bonus2", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Athlete<small>(str/wis)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="bluff" value={data.dec} onChange={(e) => updateField("dec", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["dec-bonus"]} onChange={(e) => updateField("dec-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Bluff<small>(cha)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="care" value={data.ani} onChange={(e) => updateField("ani", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ani-bonus"]} onChange={(e) => updateField("ani-bonus", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ani-bonus2"]} onChange={(e) => updateField("ani-bonus2", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Care<small>(wis/cha)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="diplo" value={data.pers} onChange={(e) => updateField("pers", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["pers-bonus"]} onChange={(e) => updateField("pers-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Diplo<small>(cha)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="finesse" value={data.sli} onChange={(e) => updateField("sli", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["sli-bonus"]} onChange={(e) => updateField("sli-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Finesse<small>(dex)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="grit" value={data.grit} onChange={(e) => updateField("grit", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["grit-bonus"]} onChange={(e) => updateField("grit-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Grit<small>(con)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="intimid" value={data.intim} onChange={(e) => updateField("intim", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["intim-bonus0"]} onChange={(e) => updateField("intim-bonus0", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["intim-bonus"]} onChange={(e) => updateField("intim-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Intimid<small>(str/cha)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="invest" value={data.invest} onChange={(e) => updateField("invest", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["invest-bonus"]} onChange={(e) => updateField("invest-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Invest<small>(int)</small></p>
            </label>
          </div>
          <div className="w-1/2 flex flex-col gap-[1px]">
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="know" value={data.his} onChange={(e) => updateField("his", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["his-bonus"]} onChange={(e) => updateField("his-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Know<small>(int)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="medic" value={data.medi} onChange={(e) => updateField("medi", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["medi-bonus0"]} onChange={(e) => updateField("medi-bonus0", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["medi-bonus"]} onChange={(e) => updateField("medi-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Medic<small>(int/wis)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="percept" value={data.perc} onChange={(e) => updateField("perc", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["perc-bonus"]} onChange={(e) => updateField("perc-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Percept<small>(wis)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="pres" value={data.perf} onChange={(e) => updateField("ani", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["perf-bonus"]} onChange={(e) => updateField("perf-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Pres<small>(cha)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="science" value={data.sci} onChange={(e) => updateField("sci", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["sci-bonus"]} onChange={(e) => updateField("sci-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Science<small>(int)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="sneak" value={data.steal} onChange={(e) => updateField("steal", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["steal-bonus"]} onChange={(e) => updateField("steal-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Sneak<small>(dex)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="super" value={data.arc} onChange={(e) => updateField("arc", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["arc-bonus"]} onChange={(e) => updateField("arc-bonus", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["arc-bonus2"]} onChange={(e) => updateField("arc2-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Super<small>(int/wis)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="surviv" value={data.surv} onChange={(e) => updateField("surv", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["surv-bonus0"]} onChange={(e) => updateField("surv-bonus0", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["surv-bonus"]} onChange={(e) => updateField("surv-bonus", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Surviv<small>(int/wis)</small></p>
            </label>
            <label className="flex justify-between items-end">
              <div className="flex gap-[2px]">
                <ProficiencySelect name="vibe" value={data.ins} onChange={(e) => updateField("ins", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ins-bonus"]} onChange={(e) => updateField("ins-bonus", e.target.value)}/>
                <input className="border-0 self-end mb-[1px] border-black border-b-1 bg-white w-[20px] h-[12px] p-0 text-center" value={data["ins-bonus2"]} onChange={(e) => updateField("ins-bonus2", e.target.value)}/>
              </div>
              <p className="text-left w-1/2">Vibe<small>(wis/cha)</small></p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}