"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import { ContentListData } from "./ContentList";
import { redirect, usePathname } from "next/navigation";

import styles from "./ContentList.module.css";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";

export default function ContentListItem({content, colWidths, depth}: {content: ContentListData, colWidths?: string[], depth?: number}) {
  const [isExpanded, setIsExpanded] = useState(content.isExpanded ?? false);
  const path = usePathname();

  const isSelected = decodeURIComponent(path).includes("/" + content.name.toLowerCase());
  const isLink = content.isLink ?? true;
  const hasSubItems = content.subContent && content.subContent.length > 0;

  useEffect(() => {
    if (isSelected) {
      const elem = document.querySelector(`[data-key="${content.name}"]`) as HTMLElement;
      const parent = document.querySelector(`.overflow-y-scroll:has([data-key="${content.name}"])`);
      parent?.scrollTo({top: elem?.offsetTop - 35, behavior: "smooth"});
      if(document.activeElement?.tagName != "INPUT")
        elem.focus();
    }
  })

  const handleClick = () => {
    if (hasSubItems && (isSelected || !isLink))
      setIsExpanded(!isExpanded);
    if (isLink)
      redirect(`/${path.split("/")[1]}/${encodeURIComponent(content.name.toLowerCase())}`);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key == "Enter")     
      handleClick();
  }

  if (content.isFiltered)
    return <></>;

  return (
    <>
      <div data-key={content.name} data-nav={content.isLink ?? true} onClick={() => handleClick()} onKeyDown={(e) => handleKeyDown(e)} tabIndex={0}
        className={`relative flex outline-none ${isLink ? "cursor-pointer" : ""} ${isSelected ? "font-bold bg-jj-mpurple-3 hover:bg-jj-mpurple-4 focus:bg-jj-mpurple-4" : "hover:bg-jj-mpurple-2 focus:bg-jj-mpurple-2"}`}
      >
        <div style={{"--colWidth": `${colWidths ? colWidths[0] : ""}`, "--depth": `${depth ? depth : ""}`} as React.CSSProperties} className={`${colWidths ? "w-(--colWidth)" : "w-fit"} p-1`}>{content.name}</div>
        {content.other?.map((o, i) => (
            <div style={{"--colWidth": `${colWidths ? colWidths[i + 1] : ""}`} as React.CSSProperties} key={`list-col-${i}`} className={`${colWidths ? "w-(--colWidth)" : "w-fit"} p-1`}>{o}</div>
        ))}
        {hasSubItems &&
          <div className="absolute right-1.5 top-1.5" data-expanded={isExpanded}>
            {isExpanded ? <BsCaretUpFill/> : <BsCaretDownFill/>}
          </div>
        }
      </div>
      {hasSubItems && isExpanded && 
        <div className={styles.subItems}>
          {content.subContent?.map((c) => (<ContentListItem key={`list-row-${c.name}`} content={c} colWidths={colWidths} depth={depth ? depth + 1 : 1}/>))}
        </div>
      }
    </>
  );
}