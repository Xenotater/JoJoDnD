"use client";

import HTMLInclusiveText from "@/app/Components/Display/HTMLInclusiveText";
import { FancyImage } from "@/app/Components/Layout/FancyImage/FancyImage";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { ClassData } from "@/app/Models/Classes.model";
import LevelTable from "@/app/Components/LevelTable/LevelTable";
import { useEffect, useState } from "react";

export default function ClassesContent({data}: {data: ClassData | undefined}) {
  const [variant, setVariant] = useState("Standard");
  const [varData, setVarData] = useState(data);

  useEffect(() => {
    if (!data)
      return;

    if (variant == "Standard")
      setVarData(data);

    else
      setVarData({
        ...data,
        ...data.variants!.find((v) => v.nameExt!.match(/(?<=\().*(?=\))/)![0] == variant)
      });
  }, [variant, data]);

  if (!data || !varData)
    return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>

  return (
    <div className="w-full h-full flex flex-col gap-4 mb-4">
      <div className="w-full flex justify-between">
        <ContentHeading className="underline mb-0">{varData.nameExt ? `${varData.name} ${varData.nameExt}` : varData.name}</ContentHeading>
        {data.variants &&
          <select className="mt-1 border rounded-sm h-min p-2 bg-white" value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option value="Standard">Standard</option>
            {data.variants.map((v) => {
              const vName = v.nameExt!.match(/(?<=\().*(?=\))/)![0];
              return <option key={`${data.name}-${vName}`}>{vName}</option>
            })}
          </select>
        }
      </div>
      <div className="text-center">
        <FancyImage type="border" className="m-auto mt-0 mb-2 max-w-[80%] max-h-[40vh] w-auto" src={`/images/classes/${varData.name}.webp`} alt={varData.name}/>
        {varData.examples &&
          <p>
            <small><b>Examples of {varData.exampleOf}:</b>{" "}
              {varData.examples.map((e, i) => (
                <span key={`${e}-link`}>
                  <a href={`https://jojowiki.com/${varData.links![i]}`}>{e}</a>
                  {i + 1 < varData.examples!.length &&
                    ", "
                  }
                </span>))}
            </small>
          </p>
        }
        {varData.aka &&
          <p>
            <small>Also Known As <i>{varData.aka}</i></small>
          </p>
        }
      </div>
      {(varData.hDice || varData.dc || varData.aDice) &&
        <div className="flex flex-wrap gap-2 max-w-[65%] m-auto justify-center text-center">
          <div className="flex flex-wrap grow gap-2 justify-center">
            {varData.hDice &&
              <span className="min-w-[35%]"><b>Hit Dice:</b> {varData.hDice}</span>
            }
            {varData.dc &&
              <span className="min-w-[55%]"><b>{varData.dcName ?? "DC"}:</b> {varData.dc}</span>
            }
          </div>
          <div className="flex flex-wrap grow gap-2 justify-center">
            {varData.aDice &&
              <>
                <span className="min-w-[35%]"><b>Attack Dice:</b> {varData.aDice[0]}</span>
                <span className="min-w-[55%]"><b>Attack Dice past Level 11:</b> {varData.aDice[1]}</span>
              </>
            }
          </div>
        </div>
      }
      <div>
        <ContentHeading as="h3">Description</ContentHeading>
        <p>{varData.desc}</p>
      </div>
      {varData.notes &&
        varData.notes.map((n, i) => (
          <p key={`${varData.name}-note-${i}`}><small><b>Note:</b> <i>{n}</i></small></p>
        ))
      }
      {varData.extra &&
        varData.extra.map((e) => (
          <div key={`${varData.name}-${e.name}`} className="flex flex-col gap-2">
            <p><b>{e.name}:</b> {e.desc}</p>
            {e.content &&
              e.content.map((c, i) => (
                <HTMLInclusiveText key={`${varData.name}-${e.name}-${i}`} as="div" className="max-w-[90%] m-auto" text={c}/>
              ))
            }
          </div>
        ))
      }
      {varData.other &&
        varData.other.map((o) => (
          <div key={`${varData.name}-${o.name}`}>
            <ContentHeading as="h3">{o.name}</ContentHeading>
            {o.content.map((c, i) => (
              <HTMLInclusiveText key={`${varData.name}-${o.name}-${i}`} as="div" className="mb-2" text={c}/>
            ))}
          </div>
        ))
      }
      {varData.mults &&
        <div>
          <ContentHeading as="h3">Stat Conversion</ContentHeading>
          <p className="text-center"><b>Ability Score Multipliers:</b></p>
          <table className="table-striped table-borders table-minor m-auto">
            <thead><tr><th>Stat</th><th>Multiplier</th></tr></thead>
            <tbody>
              <tr><td>Power</td><td>Str x{varData.mults[0]}</td></tr>
              <tr><td>Precision</td><td>Dex x{varData.mults[1]}</td></tr>
              <tr><td>Durability</td><td>Con x{varData.mults[2]}</td></tr>
              <tr><td>Range</td><td>Int x{varData.mults[3]}</td></tr>
              <tr><td>Speed</td><td>Wis x{varData.mults[4]}</td></tr>
              <tr><td>Stand Energy</td><td>Cha x{varData.mults[5]}</td></tr>
            </tbody>
          </table>
        </div>
      }
      {varData.levelUp &&
        <div>
          <ContentHeading as="h3">Increasing Stand Stats</ContentHeading>
          <HTMLInclusiveText as="div" text={varData.levelUp}/>
        </div>
      }
      {varData.levels &&
        <div>
          <ContentHeading as="h3">Leveling Up</ContentHeading>
          <LevelTable afterLabels={varData.otherCols?.map((c) => c.name)} headBg={varData.theme} levels={
            varData.levels.map((l, i) => ({
              features: l,
              afterEx: varData.otherCols?.map((c) => c.level[i] as string)
            }))}/>
        </div>
      }
    </div>
  )
}