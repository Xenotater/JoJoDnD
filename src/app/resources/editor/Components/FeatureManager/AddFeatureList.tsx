"use client";

import {SimpleFeature} from "./ManageFeaturesModal";
import {abilities, tags as abilityTags} from "@/../public/data/abilities.json";
import {feats, tags as featTags} from "@/../public/data/feats.json";
import ContentList, {ContentListData} from "@/app/Components/Content/ContentList/ContentList";
import {getAbilityData, getFeatData} from "@/app/Utilities/content.utility";
import FeatureSelector from "./FeatureSelector";
import {BsArrowLeft} from "react-icons/bs";
import {useState} from "react";
import { ContentTags } from "@/app/Models/Misc.model";

export default function AddFeatureList({includeAbilities, selectedFeatures, selectCallback, backCallback}: {includeAbilities: boolean; selectedFeatures: SimpleFeature[]; selectCallback: (item: SimpleFeature) => void; backCallback: () => void}) {
  const assembleAbilities = () => {
    const newAbilities: ContentListData[] = [];
    for (const ability of abilities) {
      if (!(ability.isSub ?? false))
        newAbilities.push({
          name: ability.name,
          other: ability.subAbilities ? [] : [<FeatureSelector key={ability.name} feature={selectedFeatures.find((f) => f.name === ability.name) ?? {name: ability.name, count: 0, type: "ability"}} isClass={includeAbilities} allowMultiple={ability.tags?.includes("Stackable") ?? false} />],
          subContent: ability.subAbilities?.flatMap((a) => {
            const subAbil = getAbilityData(a);
            if (!subAbil) return [];
            return {
              name: subAbil.name,
              other: [<FeatureSelector key={subAbil.name} feature={selectedFeatures.find((f) => f.name === subAbil.name) ?? {name: subAbil.name, count: 0, type: "ability"}} isClass={includeAbilities} allowMultiple={subAbil.tags?.includes("Stackable") ?? false} />],
              tags: subAbil.tags,
              isLink: false,
              onClick: () => selectCallback({name: subAbil.name, count: 0, type: "ability"}),
            } as ContentListData;
          }),
          tags: ability.tags,
          isExpanded: ability.expanded ?? true,
          isLink: false,
          onClick: () => selectCallback({name: ability.name, count: 0, type: "ability"}),
        });
    }
    return newAbilities;
  };

  const [abilitiesContent] = useState(assembleAbilities());

  const assembleFeats = () => {
    const newFeats: ContentListData[] = [];
    for (const feat of feats) {
      if (!(feat.isSub ?? false))
        newFeats.push({
          name: feat.name,
          other: feat.subFeats ? [] : [<FeatureSelector key={feat.name} feature={selectedFeatures.find((f) => f.name === feat.name) ?? {name: feat.name, count: 0, type: "feat"}} isClass={includeAbilities} allowMultiple={feat.tags?.includes("Stackable") ?? false} />],
          subContent: feat.subFeats?.flatMap((f) => {
            const subFeat = getFeatData(f);
            if (!subFeat) return [];
            return {
              name: subFeat.name,
              other: [<FeatureSelector key={subFeat.name} feature={selectedFeatures.find((f) => f.name === subFeat.name) ?? {name: subFeat.name, count: 0, type: "ability"}} isClass={includeAbilities} allowMultiple={subFeat.tags?.includes("Stackable") ?? false} />],
              tags: subFeat.tags,
              isLink: false,
              onClick: () => selectCallback({name: subFeat.name, count: 0, type: "feat"}),
            } as ContentListData;
          }),
          tags: feat.tags,
          isExpanded: feat.expanded ?? true,
          isLink: false,
          onClick: () => selectCallback({name: feat.name, count: 0, type: "feat"}),
        });
    }
    return newFeats;
  };

  const [featsContent] = useState(assembleFeats());

  // useEffect(() => {

  // })

  const listContent = includeAbilities ? abilitiesContent.concat(featsContent) : featsContent;
  const tags = includeAbilities ? (() => {
    const newTags: ContentTags[] = [];
    abilityTags.concat(featTags).forEach((c) => {
      if (/^[^ ]* Type/.test(c.category))
        c.category = "Feature Type";
      const existing = newTags.find(t => t.category == c.category);
      if (existing) {
        const subTags = new Set(existing.tags);
        c.tags.forEach(t => subTags.add(t));
        existing.tags = Array.from(subTags);
      }
      else
        newTags.push(c);
    });
    return newTags;
  })() : featTags;

  return (
    <div className="h-full w-full">
      <ContentList
        content={listContent}
        tags={tags}
        options={{
          columns: [
            {name: includeAbilities ? "Class Features" : "Feats", sort: true, width: "75%"},
            {name: "Selected", width: "25%"},
          ],
          height: "100%",
          width: "100%",
          filter: true,
          search: true,
          sticky: false
        }}
      />
      <BsArrowLeft className="absolute top-2 right-2 md:right-[66%] bg-jj-mpurple-1 cursor-pointer hover:bg-jj-mpurple-2 hover:shadow-md/66 border border-2 border-(--border) rounded-full p-1 z-100" size={32} onClick={backCallback} />
    </div>
  );
}
