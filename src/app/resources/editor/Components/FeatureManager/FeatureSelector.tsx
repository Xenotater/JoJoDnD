"use client";

import { useState } from "react";
import { SimpleFeature } from "./ManageFeaturesModal";
import { useCharacterManager } from "../CharacterManagement/CharacterManagementContext";

export default function FeatureSelector({feature, isClass, allowMultiple}: {feature: SimpleFeature, isClass: boolean, allowMultiple: boolean}) {
  const manager = useCharacterManager();
  const [feat, setFeat] = useState(feature);

  const handleChange = (newCount: number) => {
    setFeat({...feat, count: newCount})

    const classFeats = manager.loadedCharacter.data.classFeats ?? "";
    const otherFeats = manager.loadedCharacter.data.otherFeats ?? "";
    let newFeats = isClass ? classFeats : otherFeats;

    if (newCount == 0)
      newFeats = newFeats.replaceAll(new RegExp(`${feature.name}( ?x\d+| ?\(.*\))?`, "g"), "");
    else {
      const existing = newFeats.includes(feature.name);
      if (existing) {
        let count = 0;
        newFeats = newFeats.replace(new RegExp(`${feature.name}( ?x\d+| ?\(.*\))?`, "g"), () => {
          count ++;
          return count === 1 ? `${feature.name}${newCount > 1 ? ` x${newCount}` : ""}` : "";
        });
      }
      else {
        newFeats += `\n${feature.name}${newCount > 1 ? ` x${newCount}` : ""}`;
      }
      newFeats = newFeats.replace(/\n\n/, "\n");
    }

    manager.save({
      ...manager.loadedCharacter,
      data: {
        ...manager.loadedCharacter.data,
        classFeats: isClass ? newFeats : classFeats,
        otherFeats: isClass ? otherFeats : newFeats
      }
    })
  }

  return (
    <div className="w-full h-full flex justify-center items-center z-2">
      {allowMultiple ? 
      <input type="number" className="w-full" value={feat.count} min="0" onChange={(e) => handleChange(parseInt(e.target.value ?? "0") || 0)}/>
      : <input type="checkbox" className="accent-(--border) outline-(--border) h-[20px] aspect-1/1" checked={feat.count > 0} onChange={() => handleChange(feat.count > 0 ? 0 : 1)}/>
    }
    </div>
  )
}