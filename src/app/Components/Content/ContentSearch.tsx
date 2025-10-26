"use client";

//TODO: add other data types here
import {tabs} from "@/../public/data/rules.json";
import {passions} from "@/../public/data/passions.json";
import {races} from "@/../public/data/races.json";
import {abilities} from "@/../public/data/abilities.json";
import {feats} from "@/../public/data/feats.json";
import {weapons} from "@/../public/data/weapons.json";

import { useEffect, useRef, useState } from "react";
import DisplayModal from "../Display/DisplayModal";
import GenericContentComponent from "./GenericContentComponent";
import { BsSearch } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SearchResult {
  name: string;
  page: string;
  link: string;
}

export default function ContentSearch({headerCollapsed, className}: {headerCollapsed: boolean, className?: string}) {
  const path = usePathname();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | undefined>(undefined);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [allContent] = useState(() => {
    const contentList: SearchResult[] = [];

    tabs.forEach((tab) => {
      contentList.push({
        name: tab.title,
        page: "Rules",
        link: `/rules/${tab.title}`
      });
      tab.sections.forEach((section) => {
        if (section.heading)
        section.items.forEach((item) => {
          contentList.push({
            name: item.subheading,
            page: `Rules`,
            link: `/rules/${tab.title}/#${item.subheading.replaceAll(/[^A-z]/g, "")}`
          });
        });
      });
    });

    passions.forEach((passion) => {
      contentList.push({
        name: passion.name,
        page: "Passions",
        link: `/passions/${encodeURIComponent(passion.name)}`
      });
    });

    races.forEach((race) => {
      contentList.push({
        name: race.name,
        page: "Races",
        link: `/races/${encodeURIComponent(race.name)}`
      });
    });

    abilities.forEach((ability) => {
      contentList.push({
        name: ability.name,
        page: "Abilities",
        link: `/abilities/${encodeURIComponent(ability.name).replace("'", "%27")}`
      });
    });

    feats.forEach((feat) => {
      if (!feat.subFeats)
        contentList.push({
          name: feat.name,
          page: "Feats",
          link: `/feats/${encodeURIComponent(feat.name)}`
        });
      else
        contentList.push({
          name: feat.name,
          page: "Feats",
          link: `/feats/${feat.name}?filter=${feat.name.replace(/s$/, "")}`
      })
    })
    
    weapons.forEach((weapon) => {
      contentList.push({
        name: weapon.name,
        page: "Weapons",
        link: `/weapons#${weapon.name}`,
      });
    });

    contentList.push({
      name: "Weapon Attributes",
      page: "Weapons",
      link: `/weapons#attributes`,
    });

    return contentList;
  });

  useEffect(() => {
    setSelected(undefined);
    setSearch("");
  }, [path])

  useEffect(() => {
    modalRef.current?.children[0].scrollTo(0, 0);
    if (selected && selected.link.includes("#")) {
      try {
        modalRef.current?.querySelector(selected.link.replace(/^.*#/, "#"))?.scrollIntoView();
      } catch {} //don't error on bad queryselector
    }
  }, [selected])

  useEffect(() => getResults(), [search]);

  const getResults = () => {
    setResults([]);
    if (!search) return;
    const result = [...allContent].filter((item) => {
      const pattern = new RegExp(`.*${search.toLowerCase()}.*`, "g");
      return  pattern.test(item.name.toLowerCase()) || pattern.test(item.page.toLowerCase());
    });
    setResults(result);
  };

  return (
    <div className={`${className} flex flex-col md:flex-row-reverse justify-right fixed ${headerCollapsed ? "top-0" : "top-(--headerHeight)"} right-[calc(50%-150px)] md:right-[12px] z-999`} onMouseLeave={() => setSelected(undefined)}>
      <div className="flex flex-col w-full max-w-[300px]">
        <search className={"relative border-2 border-t-0 border-(--border) p-0.5 bg-(--foreground)"}>
          <BsSearch className="absolute m-1"/>
          <input type="search" className="w-full pl-7 pb-0.5" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              onBlur={(e) => {if (!e.relatedTarget?.classList.contains("result")) setResults([])}} onFocus={() => getResults()}/>
        </search>
        {search && results.length > 0 &&
          <div className="flex flex-col max-h-[40vh] overflow-y-scroll border-2 border-t-0 border-(--border) bg-(--foreground) shadow-black shadow-md">
            {results.map((r, i) => (
              <Link href={r.link} key={`result-${i}`} tabIndex={0} className="result flex flex-col md:flex-row justify-between md:gap-8 not-first:border-t hover:bg-jj-mpurple-2 focus:bg-jj-mpurple-2 p-0.5"
                  onMouseEnter={() => setSelected(r)} onFocus={() => setSelected(r)} onBlur={() => setSelected(undefined)}>
                <span className="pl-2">{r.name}</span>
                <span className="text-jj-purple-3 pl-2 md:pl-0 md:pr-2"><i>{r.page}</i></span>
              </Link>
            ))}
          </div>
        }
      </div>
      {results.length > 0 && selected &&
        <DisplayModal ref={modalRef} hideMobile className="static max-h-[calc(40vh+28px)]">
          <GenericContentComponent page={selected.page.toLowerCase()} item={decodeURIComponent(selected.link.split(/[\/\#\?]/)[2])}/>
        </DisplayModal>
      }
    </div>
  )
}