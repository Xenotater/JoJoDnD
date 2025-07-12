"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { BsCaretRightFill, BsCaretLeftFill, BsList } from "react-icons/bs";
import DesktopHeaderList from "./Desktop/DesktopHeaderList";

import styles from "./Header.module.css";
import MobileHeaderList from "./Mobile/MobileHeaderList";

export default memo(function Header() {
  const [isDesktopWidth, setIsDesktopWidth] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => setIsDesktopWidth(window.innerWidth >= 1024), []);

  return (
    <div>
      <div className={`${styles.header} ${isCollapsed ? styles.collapsed : ""} fixed top-0 flex justify-between w-full h-25`}>
        <div className="flex items-center gap-2">
          <Link href="/"><Image src="/logo/icon.webp" alt="icon" width={216} height={90}/></Link>
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