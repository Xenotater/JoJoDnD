"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { BsCaretRightFill, BsCaretLeftFill, BsList } from "react-icons/bs";
import DesktopHeaderList from "./Desktop/DesktopHeaderList";
import MobileHeaderList from "./Mobile/MobileHeaderList";
import { usePathname } from "next/navigation";


import styles from "./Header.module.css";
export default memo(function Header() {
  const [isDesktopWidth, setIsDesktopWidth] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const path = usePathname();
  
  useEffect(() => {
    const handleResize = () => setIsDesktopWidth(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  //close mobile menu on navigation if open
  useEffect(() => setIsMenuOpen(false), [path]);

  return (
    <div>
      <div className={`${styles.header} ${isCollapsed ? styles.collapsed : ""} fixed top-0 z-100 flex justify-between w-full ${isDesktopWidth ? "h-25" : "h-18"}`}>
        <div className="flex items-center gap-2">
          <Link href="/"><Image src="/logo/icon.webp" alt="icon" width={isDesktopWidth ? 216 : 144} height={isDesktopWidth ? 90 : 60}/></Link>
          {isDesktopWidth && !isCollapsed &&
            <DesktopHeaderList/>
          }
        </div>
        {isDesktopWidth ?
          <div className={`cursor-pointer h-min text-white absolute ${isCollapsed ? "top-[4] right-[16]" : "top-[8] right-[8]"}`} onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <BsCaretRightFill size={"2rem"}/> : <BsCaretLeftFill size="2rem"/>}
          </div>
          :
          <div className="cursor-pointer h-min text-white self-center mr-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <BsList size="3rem"/>
          </div>
        }
      </div>
      {isMenuOpen &&
        <MobileHeaderList/>
      }
    </div>
  )
})