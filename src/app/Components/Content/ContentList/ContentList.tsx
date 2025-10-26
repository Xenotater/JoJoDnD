"use client";

import ContentListItem from "./ContentListItem";

import styles from "./ContentList.module.css";
import { JSX, useEffect, useRef, useState } from "react";
import { BsCaretDown, BsCaretDownFill, BsCaretUp, BsCaretUpFill, BsFilter, BsSearch } from "react-icons/bs";
import ContentFilterModal from "./ContentFilterModal";
import { usePathname, useSearchParams } from "next/navigation";
import { toTitleCase } from "@/app/Utilities/misc.utility";
import Tooltip from "../../Layout/Typography/Tooltip";
import cloneDeep from "lodash/cloneDeep";
import { ContentTags } from "@/app/Models/Misc.model";

export interface ContentListData {
  name: string;
  other?: (JSX.Element | string)[];
  subContent?: ContentListData[];
  isExpanded?: boolean;
  isLink?: boolean;
  tags?: string[];
  isFiltered?: boolean;
}

interface ContentListOptions {
  width?: string;
  height?: string;
  scrollWidth?: string;
  columns?: {
      name: string;
      tooltip?: string;
      width?: string;
      sort?: boolean;
      sortFn?: (a: unknown, b: unknown) => number;
    }[]
  search?:boolean;
  filter?: boolean;
}

//TODO: split filter logic toggles per category, keyboard navigation
export default function ContentList({content, title, tags, options}: {content: ContentListData[], title?: string, tags?: ContentTags[], options?: ContentListOptions}) {
  const path = usePathname();
  const params = useSearchParams();
  const listRef = useRef<HTMLDivElement>(null);
  const [contentList, setContentList] = useState(cloneDeep(content));
  const [includeList, setIncludeList] = useState(params.has("filter") ? new Set<string>(params?.get("filter")?.split(",")) : new Set<string>());
  const [excludeList, setExcludeList] = useState(new Set<string>());
  const [logic, setLogic] = useState<["OR"|"AND", "OR"|"AND"]>(["OR", "OR"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState(decodeURIComponent(params?.get("search") || ""));
  const [sortedCol, setSortedCol] = useState(options?.columns?.flatMap((c, i) => {
    if (c.sort)
      return [i, "up"];
    return [];
  }) ?? []);
  const colIsTitle = options && options.columns?.length == 1 && !title;

  //re-apply filters and sort when any relevant settings change
  useEffect(() => checkFilterSort(), [includeList, excludeList, logic, search, sortedCol, params])

  const checkFilterSort = () => {
    window.history.replaceState(null, "", window.location.href.replace(/\?[^#]*/, "") + `${search ? `?search=${encodeURIComponent(search)}` : ""}`)
    const copy = cloneDeep(content), newList: ContentListData[] = [];
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
    else{
      return sortFn(getText(a.other!.at(index - 1)!), getText(b.other!.at(index - 1)!)) * dirMult;
  }}

  const getText = (item: string | JSX.Element) => {
    return typeof item === "string" ? item : item.props.children;
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

  useEffect(() => {
    const listElem = listRef.current;
    const selectedElem = document.querySelector(`[data-key='${toTitleCase(decodeURIComponent(path.split("/")[2]).replace("'", ""))}']`);

    if(listElem) {

      const handleKeypress = (e: KeyboardEvent) => {
        if (e.repeat)
          return;
        if (e.key == "ArrowDown" || e.key == "ArrowRight") {
          e.preventDefault();
          const items = listElem.querySelectorAll("[data-nav='true']")
          items.forEach((item, i) => {
            if (item == selectedElem && i < items.length - 1)
              (items[i+1] as HTMLElement).click();
          });
        }
        if (e.key == "ArrowUp" || e.key == "ArrowLeft") {
          e.preventDefault();
          const items = listElem.querySelectorAll("[data-nav='true']")
          items.forEach((item, i) => {
            if (item == selectedElem && i > 0)
              (items[i-1] as HTMLElement).click();
          });
        }
      };

      listElem.addEventListener("keydown", handleKeypress);

      return () => {
        listElem.removeEventListener("keydown", handleKeypress);
      }
    }
  }, [path]);

  return (
    <div ref={listRef}
      style={{"--height": `${options?.height ?? ""}`, "--width": `${options?.width ?? ""}`, "--headHeight": `${options?.search ? "106px" : "76px"}`, "--scrollWidth": `${options?.scrollWidth ?? ""}`} as React.CSSProperties}
      className={`
        ${styles.list}
        content flex flex-col p-0 w-full
        ${options?.height ? `max-h-(--height)` : ""}
        ${options?.width ? `md:w-(--width)` : "md:w-fit"}
        overflow-x-scroll hideScroll
      `}
    >
      <div className={`${styles.listHead} ${options?.scrollWidth ? `min-w-(--scrollWidth)` : ""}`}>
        {title &&
          <h3 className="font-bold text-center p-1">{title}</h3>
        }
        {options?.search &&
          <div className="flex items-center text-lg">
            {options?.filter && tags && <div className="cursor-pointer flex items-center pl-1 pr-2" onClick={() => setIsModalOpen(true)}><BsFilter/>Filter</div>}
            <search className={`${options?.filter ? "border-l" : ""} grow-1 relative`}>
              <BsSearch className="absolute m-1"/>
              <input type="search" className="w-full pl-7" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setSearch(e.target.value);}}/>
            </search>
          </div>
        }
        {options?.columns && options.columns.length > 0 &&
          <div className="flex">{options.columns.map((c, i) => (
            <div key={`list-col-lbl-${c.name}`} style={{"--colWidth": `${c.width ?? ""}`} as React.CSSProperties}
              className={`${c.width ? "w-(--colWidth)" : "grow-1"} ${colIsTitle ? "text-3xl" : ""} p-1 text-center font-bold relative`}>
              {c.tooltip ?
                <Tooltip label={c.name}>{c.tooltip}</Tooltip>
                : c.name
              }
              {c.sort &&
                <div className="absolute top-0 right-1 flex flex-col justify-between text-sm cursor-pointer">
                  <div onClick={() => setSortedCol([i, "up"])}>{sortedCol[0] == i && sortedCol[1] == "up" ? <BsCaretUpFill size={colIsTitle ? "22px" : ""}/> : <BsCaretUp size={colIsTitle ? "22px" : ""}/>}</div>
                  <div onClick={() => setSortedCol([i, "down"])}>{sortedCol[0] == i && sortedCol[1] == "down" ? <BsCaretDownFill size={colIsTitle ? "22px" : ""}/> : <BsCaretDown size={colIsTitle ? "22px" : ""}/>}</div>
                </div>
              }
            </div>))}
          </div>
        }
      </div>
      <div className={`${styles.listBody} relative overflow-y-scroll hideScroll ${options?.scrollWidth ? `min-w-(--scrollWidth)` : ""}`}>
        {contentList.map((c) => (
          <ContentListItem key={`list-row-${c.name}`} content={c} colWidths={options?.columns?.flatMap((c) => c.width ?? "auto")}/>
        ))}
      </div>
      {isModalOpen && tags &&
        <ContentFilterModal tags={tags} includes={includeList} excludes={excludeList} logic={logic}
          setIncludes={setIncludeList} setExcludes={setExcludeList} setLogic={setLogic} closer={() => setIsModalOpen(false)}/>
      }
    </div>
  );
}