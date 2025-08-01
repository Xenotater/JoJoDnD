"use client";

import ContentListItem from "./ContentListItem";

import styles from "./ContentList.module.css";
import { useEffect, useState } from "react";
import { BsCaretDown, BsCaretDownFill, BsCaretUp, BsCaretUpFill, BsFilter, BsSearch } from "react-icons/bs";
import ContentFilterModal from "./ContentFilterModal";
import { getTags } from "@/app/Utilities/content.utility";

export interface ContentListData {
  name: string;
  other?: string[];
  subContent?: ContentListData[];
  isExpanded?: boolean;
  isLink?: boolean;
  tags?: string[];
  isFiltered?: boolean;
}

interface ContentListOptions {
  width?: string;
  height?: string;
  columns?: {
      name: string;
      width?: string;
      sort?: boolean;
      sortFn?: (a: string, b: string) => number;
    }[]
  search?:boolean;
  filter?: boolean;
}

//TODO: filter modal UI, keyboard navigation
export default function ContentList({content, title, options}: {content: ContentListData[], title: string, options?: ContentListOptions}) {
  const [contentList, setContentList] = useState(structuredClone(content));
  const [includeList, setIncludeList] = useState(new Set<string>());
  const [excludeList, setExcludeList] = useState(new Set<string>());
  const [logic, setLogic] = useState<["OR"|"AND", "OR"|"AND"]>(["OR", "OR"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortedCol, setSortedCol] = useState(options?.columns?.flatMap((c, i) => {
    if (c.sort)
      return [i, "up"];
    return [];
  }) ?? []);

  //re-apply filters and sort when any relevant settings change
  useEffect(() => checkFilterSort(), [includeList, excludeList, logic, search, sortedCol])

  const checkFilterSort = () => {
    const copy = structuredClone(content), newList: ContentListData[] = [];
    copy.forEach((item) => addFilteredItem(item, newList));
    if (sortedCol.length > 0)
      newList.sort((a, b) => itemSort(a, b));
    setContentList(newList);
  }

  const itemSort = (a: ContentListData, b: ContentListData) => {
    const index = sortedCol[0] as number;
    const dirMult = sortedCol[1] == "up" ? 1 : -1;
    const sortFn = options?.columns?.at(index)?.sortFn ?? ((a: string, b: string) => a > b ? 1 : -1);
    if (index == 0)
      return sortFn(a.name, b.name) * dirMult;
    else
      return sortFn(a.other!.at(index - 1)!, b.other!.at(index - 1)!) * dirMult;
  }

  const addFilteredItem = (item: ContentListData, list: ContentListData[], parent?: ContentListData) => {
    let filtered = false;
    if (!item.name.toLowerCase().includes(search.toLowerCase())) //exclude items that don't match the search
      filtered = true;
    else if (item.tags) { //do tag checks if tags are present
      if (logic[0] == "OR" && includeList.size > 0) {
        filtered = true;
        item.tags.forEach((tag) => {
          if (includeList.has(tag)) {
            filtered = false; //include items with ANY included tags
            return;
          }
        })
      }
      else {
        includeList.forEach((include) => {
          if (!item.tags!.includes(include)) { //exclude items without ALL included tags
            filtered = true;
            return;
          }
        });
      }
      if (logic[1] == "OR") {
        item.tags.forEach((tag) => {
          if (excludeList.has(tag)) { //exclude items with ANY excluded tags
            filtered = true;
            return;
          }
        });
      }
      else if (excludeList.size > 0) {
        filtered = true;
        excludeList.forEach((exclude) => {
          if (!item.tags!.includes(exclude)) {
            filtered = false; //include items without ALL excluded tags
            return;
          }
        })
      }
    }
    else if (includeList.size > 0) //include filters exclude non-tagged items
      filtered = true;
    if (item.subContent) { //subcontent causes messy recursion for add. filter checks on subitems
      let allFiltered = true;
      const subItems = item.subContent;
      item.subContent = []; //empty list, we'll add unfiltered items back
      subItems.forEach((sub) => {
        if (!addFilteredItem(sub, list, item)) //run filter checks on subitems
          allFiltered = false;
      });
      if (!(item.isLink ?? true) && allFiltered) //exclude items that aren't links and have no unfiltered subitems
        filtered = true;
      else if (filtered && !allFiltered) //include items that were filtered but have unfiltered subitems
        filtered = false;
    }
    if (parent && !filtered) {
      if (parent.subContent)
        parent.subContent.push(item); //add unfiltered subitems back to parent item
    }
    else if (!filtered)
      list.push(item); //add unfiltered items to content list
    return filtered;
  }

  return (
    <div
      style={{"--height": `${options?.height ?? ""}`, "--width": `${options?.width ?? ""}`, "--headHeight": `${options?.search ? "106px" : "76px"}`} as React.CSSProperties}
      className={`
        ${styles.list}
        content flex flex-col p-0 max-w-[90vw] max-h-[40vh]
        ${options?.height ? `h-(--height)` : ""}
        ${options?.width ? `w-(--width)` : "w-fit"}
      `}
    >
      <div className={styles.listHead}>
        <h3 className="font-bold text-center p-1">{title}</h3>
        {options?.search &&
          <div className="flex items-center text-lg">
            {options?.filter && <div className="cursor-pointer flex items-center pl-1 pr-2" onClick={() => setIsModalOpen(true)}><BsFilter/>Filter</div>}
            <search className={`${options?.filter ? "border-l" : ""} grow-1 relative`}>
              <BsSearch className="absolute m-1"/>
              <input type="search" className="w-full pl-7" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setSearch(e.target.value);}}/>
            </search>
          </div>
        }
        {options?.columns && options.columns.length > 0 &&
          <div className="flex">{options.columns.map((c, i) => (
            <div key={`list-col-lbl-${c.name}`} style={{"--colWidth": `${c.width ?? ""}`} as React.CSSProperties}
              className={`${c.width ? "w-(--colWidth)" : "grow-1"} p-1 text-center font-bold relative`}>
              {c.name}
              {c.sort &&
                <div className="absolute top-0 right-1 flex flex-col justify-between text-sm cursor-pointer">
                  <div onClick={() => setSortedCol([i, "up"])}>{sortedCol[0] == i && sortedCol[1] == "up" ? <BsCaretUpFill/> : <BsCaretUp/>}</div>
                  <div onClick={() => setSortedCol([i, "down"])}>{sortedCol[0] == i && sortedCol[1] == "down" ? <BsCaretDownFill/> : <BsCaretDown/>}</div>
                </div>
              }
            </div>))}
          </div>
        }
      </div>
      <div className={`${styles.listBody} relative overflow-y-scroll hideScroll`}>
        {contentList.map((c) => (
          <ContentListItem key={`list-row-${c.name}`} content={c} colWidths={options?.columns?.flatMap((c) => c.width ?? "auto")}/>
        ))}
      </div>
      {isModalOpen &&
        <ContentFilterModal tags={getTags("Passions")} includes={includeList} excludes={excludeList} logic={logic}
          setIncludes={setIncludeList} setExcludes={setExcludeList} setLogic={setLogic} closer={() => setIsModalOpen(false)}/>
      }
    </div>
  );
}