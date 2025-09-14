"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { BsCaretRightFill, BsCaretLeftFill, BsList } from "react-icons/bs";
import DesktopHeaderList from "./Desktop/DesktopHeaderList";
import MobileHeaderList from "./Mobile/MobileHeaderList";
import { usePathname } from "next/navigation";


import styles from "./Header.module.css";
import { useResize } from "@/app/Hooks/useResize";
import ContentSearch from "../Content/ContentSearch";
export default memo(function Header() {
  const [isDesktopWidth, setIsDesktopWidth] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const path = usePathname();

  //content space gets bigger when header is collapsed
  const handleCollapse = () => {
    if (!isCollapsed)
      document.querySelector(".contentWrapper")?.setAttribute("style", "margin-top: 0; height: 100vh;");
    else
      document.querySelector(".contentWrapper")?.removeAttribute("style");
    setIsCollapsed(!isCollapsed);
  };
  
  useResize(() => {
    setIsDesktopWidth(window.innerWidth >= 1024);
    if (window.innerWidth < 1024)
      setIsCollapsed(false);
    else
      setIsMenuOpen(false);
  });

  //close mobile menu on navigation if open
  useEffect(() => setIsMenuOpen(false), [path]);

  return (
    <div id="siteHeader" className="z-999">
      <div className={`${styles.header} ${isCollapsed ? styles.collapsed : ""} fixed top-0 flex justify-between w-full h-(--headerHeight)`}>
        <div className="flex items-center gap-2">
          <Link href="/"><Image src="/logo/icon.webp" alt="icon" width={isDesktopWidth ? 216 : 144} height={isDesktopWidth ? 90 : 60}/></Link>
          {isDesktopWidth && !isCollapsed &&
            <DesktopHeaderList/>
          }
        </div>
        {isDesktopWidth ?
          <div className={`cursor-pointer h-min text-white absolute ${isCollapsed ? "top-[4] right-[16]" : "top-[8] right-[8]"}`} onClick={() => handleCollapse()}>
            {isCollapsed ? <BsCaretRightFill size={"2rem"}/> : <BsCaretLeftFill size="2rem"/>}
          </div>
          :
          <div className="cursor-pointer h-min text-white self-center mr-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <BsList size="3rem"/>
          </div>
        }
      </div>
      {isMenuOpen &&
        <div className="flex fixed top-(--headerHeight) right-0 w-full justify-end z-999">
          <ContentSearch className="static max-w-[300px] grow" headerCollapsed={false}/>
          <MobileHeaderList/>
        </div>
      }
      <ContentSearch className="hidden lg:block w-[300px]" headerCollapsed={isCollapsed}/>
    </div>
  );
})