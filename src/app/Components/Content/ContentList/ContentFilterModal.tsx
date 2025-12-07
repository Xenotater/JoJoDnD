"use client";

import { ContentTags } from "@/app/Models/Misc.model"
import { useState } from "react";
import { BsCheck } from "react-icons/bs";
import Divider from "../../Layout/Divider/Divider";
import Modal from "../../Layout/Modal/Modal";

type ContentFilterModalProps = {
  tags: ContentTags[];
  includes: Set<string>;
  excludes: Set<string>;
  logic: ["OR"|"AND", "OR"|"AND"];
  setIncludes: (list: Set<string>) => void;
  setExcludes: (list: Set<string>) => void;
  setLogic: (logic: ["OR"|"AND", "OR"|"AND"]) => void;
  closer: () => void;
}

export default function ContentFilterModal(props: ContentFilterModalProps) {
  const [includedTags, setIncludedTags] = useState(structuredClone(props.includes)); //temp states for display
  const [excludedTags, setExcludedTags] = useState(structuredClone(props.excludes));
  const [tagLogic, setTagLogic] = useState(structuredClone(props.logic));

  const toggleTag = (tag: string) => { //toggle filter state: include -> exclude -> none
    const newInclude = structuredClone(includedTags), newExclude = structuredClone(excludedTags);
    if (newInclude.has(tag)) {
      newInclude.delete(tag);
      newExclude.add(tag);
    }
    else if (newExclude.has(tag))
      newExclude.delete(tag);
    else
      newInclude.add(tag);
    setIncludedTags(newInclude);
    setExcludedTags(newExclude);
  }

  const toggleAll = (include: boolean) => {
    clearFilters();
    if (include)
      setIncludedTags(new Set<string>(props.tags.flatMap((c) => c.tags)));
    else
      setExcludedTags(new Set<string>(props.tags.flatMap((c) => c.tags)));
  }

  const clearFilters = (logic = false) => {
    setIncludedTags(new Set<string>);
    setExcludedTags(new Set<string>);
    if (logic)
      setTagLogic(["OR", "OR"]);
  }

  const applyChanges = () => {
    props.setIncludes(includedTags); //apply temp states to parent state
    props.setExcludes(excludedTags);
    props.setLogic(tagLogic);
    props.closer();
  }

  const toggleLogic = (index: 0 | 1) => {
    const newLogic = structuredClone(tagLogic);
    newLogic[index] = newLogic[index] == "OR" ? "AND" : "OR";
    setTagLogic(newLogic);
  }

  return (
    <Modal className="bg-[rgba(69,69,69,.25)]" closeCallback={props.closer} fullPage>
      <div className="content flex flex-col justify-between min-h-[40vh] w-[90vw] lg:w-[65vw] max-h-[75vh] m-auto mt-[15vh] shadow-lg z-100">
        <div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
            <h4 className="text-2xl leading-6">Filters</h4>
            <div className="flex gap-2 flex-wrap justify-center">
              <div className="flex">
                <button className="bg-jj-grayple-1 text-blue-300 rounded-sm rounded-e-none" onClick={() => toggleLogic(0)}>{tagLogic[0]}</button>
                <button className="bg-jj-grayple-1 text-red-300 rounded-sm rounded-s-none border-l-0" onClick={() => toggleLogic(1)}>{tagLogic[1]}</button>
              </div>
              <div className="flex">
                <button className="bg-blue-400 rounded-sm rounded-e-none" onClick={() => toggleAll(true)}>Include All</button>
                <button className="bg-red-400 rounded-sm rounded-s-none border-l-0" onClick={() => toggleAll(false)}>Exclude All</button>
              </div>
              <button className="bg-jj-grayple-1 rounded-sm" onClick={() => clearFilters(true)}>Reset</button>
              <button className="text-white text-xl p-0.5 bg-jj-purple-1 rounded-sm" onClick={() => applyChanges()}><BsCheck/></button>
            </div>
          </div>
          <Divider/>
        </div>
        <div className="overflow-y-scroll hideScroll grow-1 flex flex-col gap-4 pb-1">
          {props.tags.map((group) => (
            <div key={`tag-group-${group.category}`}>
              <h5 className="underline italic">{group.category}</h5>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <button key={`tag-${tag}`} className={`${includedTags.has(tag) ? "bg-blue-400" : excludedTags.has(tag) ? "bg-red-400" : ""} rounded-sm`} onClick={() => toggleTag(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full">
          <Divider/>
          <div className="flex justify-center w-full gap-4 text-lg">
            <button className="rounded-sm text-white bg-jj-purple-1" onClick={() => applyChanges()}>Apply</button>
            <button className="rounded-sm bg-jj-grayple-1" onClick={() => props.closer()}>Cancel</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}