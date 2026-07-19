"use client";

import GenericContentComponent from "@/app/Components/Content/GenericContentComponent";
import Divider from "@/app/Components/Layout/Divider/Divider";
import Modal from "@/app/Components/Layout/Modal/Modal";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import {CharacterData} from "@/app/Models/Characters.model";
import {getAbilityData, getFeatData} from "@/app/Utilities/content.utility";
import {useEffect, useState} from "react";
import {BsPencilSquare} from "react-icons/bs";
import {ImEyePlus} from "react-icons/im";
import FeatureList from "./FeatureList";
import AddFeatureList from "./AddFeatureList";

export interface SimpleFeature {
  name: string;
  count: number;
  type: "ability" | "feat";
}

export default function ManageFeaturesModal({char, className}: {char: CharacterData; className: string}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState("");
  const [selected, setSelected] = useState<SimpleFeature | undefined>();

  const classContent: SimpleFeature[] = [];
  const featsContent: SimpleFeature[] = [];
  for (const feature of char.classFeats?.split(/(\n| +[^A-z]+ +)/) ?? []) {
    const f = feature.replace(/ ?(\(.*\)|x\d)/, "");
    const isAbility = !!getAbilityData(f);
    const isFeat = !!getFeatData(f);
    if (isFeat || isAbility) {
      const existing = classContent.find((c) => c.name == f);
      const count = parseInt(feature.match(/(?<=.* ?x)\d+/)?.toString() ?? "0");
      if (existing) existing.count += count || 1;
      else classContent.push({name: f, count: 1, type: isAbility ? "ability" : "feat"});
    }
  }
  for (const feature of char.otherFeats?.split(/(\n| +[^A-z]+ +)/) ?? []) {
    const f = feature.replace(/ ?(\(.*\)|x\d)/, "");
    const count = parseInt(feature.match(/(?<=.* ?x)\d+/)?.toString() ?? "0");
    if (getFeatData(f)) {
      const existing = featsContent.find((c) => c.name == f);
      if (existing) existing.count += count || 1;
      else featsContent.push({name: f, count: count || 1, type: "feat"});
    }
  }

  useEffect(() => {
    if (!selected) setSelected(classContent.at(0) || featsContent.at(0) || undefined);
  }, [classContent, featsContent]);

  return (
    <>
      <div className={`hideMe p-0.5 rounded-full border hover:shadow-md/66 cursor-pointer ${className}`} onClick={() => setModalOpen(!modalOpen)}>
        <ImEyePlus />
      </div>
      {modalOpen && (
        <Modal fullPage blur closeCallback={() => setModalOpen(false)}>
          <div className="content relative bg-(--background) w-[80vw] h-[70vh] max-h-[600px] max-w-[1200px] flex flex-col md:flex-row gap-4">
            {editing ? (
              <div className="basis-1/2 md:basis-1/3 overflow-hidden">
                <AddFeatureList includeAbilities={editing == "class"} selectedFeatures={editing == "class" ? classContent.concat(featsContent) : featsContent} selectCallback={(item: SimpleFeature) => setSelected(item)} backCallback={() => setEditing("")} />
              </div>
            ) : (
              <div className="content p-2 basis-1/2 md:basis-1/3 flex flex-col overflow-scroll hideScroll">
                <FeatureList classFeatures={classContent} featFeatures={featsContent} selectCallback={setSelected} editCallback={(mode: string) => setEditing(mode)} />
              </div>
            )}
            <div className="content basis-1/2 md:basis-2/3 overflow-y-scroll">{selected && <GenericContentComponent page={selected.type == "ability" ? "abilities" : "feats"} item={selected.name} />}</div>
          </div>
        </Modal>
      )}
    </>
  );
}
