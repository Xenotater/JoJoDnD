"use client";

import { MouseEvent, TouchEvent, useEffect, useState } from "react";

import {tabs} from '@/../public/data/rules.json';
import DesktopRulesTabItem from "./Desktop/DesktopRulesTabItem";
import MobileRulesTabItem from "./Mobile/MobileRulesTabItem";
import { redirect, usePathname } from "next/navigation";

export default function RulesTabs() {
  const [isDesktopWidth, setIsDesktopWidth] = useState(false);
  const path = usePathname();
  
  useEffect(() => {
    const handleResize = () => setIsDesktopWidth(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  const tabList = tabs.map((t) => {
    const selected = decodeURIComponent(path).includes(t.title.toLowerCase());
    return (
      <div key={t.title} onClick={() => redirect("/rules/" + encodeURIComponent(t.title.toLowerCase()))} className="cursor-pointer"
          onTouchEnd={(e: TouchEvent) => {
            //gross jankness to fix mobile hover effects sticking after touchend
            document.querySelector(".hoverFix")?.classList.remove("hoverFix");
            let target = e.target as HTMLElement;
            if (!target.classList.toString().includes("rulesTab"))
              target = target.parentElement!;
            if (!target.classList.toString().includes("rulesTab"))
              target = target.parentElement!;
            setTimeout(() => target.classList.add("hoverFix"), 500);            
          }}>
        {isDesktopWidth ? <DesktopRulesTabItem title={t.title} selected={selected}/> : <MobileRulesTabItem title={t.title} selected={selected}/> }
      </div>
    );
  });

  return (
    isDesktopWidth ?
      <div className="flex flex-col gap-2 w-[15%] mt-8">
        {tabList}
      </div>
      :
      <div className="flex justify-between w-full max-w-[300px] h-[55px] ml-2 mr-2">
        {tabList}
      </div>
  );
}