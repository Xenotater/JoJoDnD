"use client";

import Divider from "@/app/Components/Layout/Divider/Divider";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { BsPencilSquare } from "react-icons/bs";
import { SimpleFeature } from "./ManageFeaturesModal";

export default function FeatureList({classFeatures, featFeatures, selectCallback, editCallback}: {classFeatures: SimpleFeature[], featFeatures: SimpleFeature[], selectCallback: (item: SimpleFeature) => void, editCallback: (mode: string) => void}) {
  return (
    <>
      <div className="relative flex flex-col basis-1/2 overflow-hidden">
        <BsPencilSquare className="absolute right-1 top-1 text-xl cursor-pointer hover:text-2xl hover:top-0.5 hover:right-0.5 z-2" onClick={() => editCallback("class")} />
        <ContentHeading as="h4" className="leading-5 md:text-2xl underline sticky">
          Class Features
        </ContentHeading>
        <div className="flex flex-col overflow-scroll hideScroll">
          {classFeatures.map((c, i) => (
            <div key={c.name} className={`w-full flex justify-between md:py-0.5 cursor-pointer hover:bg-jj-mpurple-2 hover:shadow-md/66 ${i < classFeatures.length - 1 ? "border-b-1 border-dashed" : ""}`} onClick={() => selectCallback(c)}>
              <span>{c.name}</span>
              {c.count > 1 && <span>x{c.count}</span>}
            </div>
          ))}
        </div>
      </div>
      <Divider className="my-1" />
      <div className="relative flex flex-col basis-1/2 overflow-hidden">
        <BsPencilSquare className="absolute right-1 top-1 text-xl cursor-pointer hover:text-2xl hover:top-0.5 hover:right-0.5" onClick={() => editCallback("feats")} />
        <ContentHeading as="h4" className="leading-5 md:text-2xl underline">
          Feats
        </ContentHeading>
        <div className="flex flex-col overflow-scroll hideScroll">
          {featFeatures.map((f, i) => (
            <div key={f.name} className={`w-full flex justify-between md:py-0.5 cursor-pointer hover:bg-jj-mpurple-2  hover:shadow-md/66 ${i < featFeatures.length - 1 ? "border-b-1 border-dashed" : ""}`} onClick={() => selectCallback(f)}>
              <span>{f.name}</span>
              {f.count > 1 && <span>x{f.count}</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
