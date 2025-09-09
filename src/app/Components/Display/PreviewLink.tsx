"use client";

import { useEffect, useRef, useState } from "react";
import DisplayModal from "./DisplayModal";
import RulesContent from "@/app/rules/Components/RulesContent";
import { getPassionData, getRaceData, getRuleContent } from "@/app/Utilities/content.utility";
import Link, { LinkProps } from "next/link";
import PassionsContent from "@/app/passions/Components/PassionsContent";
import { createPortal } from "react-dom";
import RacesContent from "@/app/races/Components/RacesContent";

export default function PreviewLink(props: LinkProps & {children: React.ReactNode}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getContentComponent = () => {
    const path = props.href?.toString().split("/");
    switch(path[1]) {
      case "rules":
        return <RulesContent data={getRuleContent(decodeURIComponent(path[2]))}/>;
      case "passions":
        return <PassionsContent data={getPassionData(decodeURIComponent(path[2]))}/>;
      case "races":
        return <RacesContent data={getRaceData(decodeURIComponent(path[2]))}/>;
      default:
        return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>;
    }
  }

  //steal scroll over this element to modal content
  useEffect(() => {
    const link = linkRef.current;

    const handleScroll = (e: WheelEvent) => {
      if (isModalOpen) {
        const modal = modalRef.current;
        if (modal) {
          e.preventDefault();
          modal.children[0].scrollTop += e.deltaY;
          modal.children[0].scrollLeft += e.deltaX;
        }
      }
    };

    link?.addEventListener("wheel", handleScroll);
    
    return () => link?.removeEventListener("wheel", handleScroll);
  })

  return (
    <>
      <Link ref={linkRef} className={`${isModalOpen ? "text-jj-purple-1" : "text-jj-purple-4"} underline relative whitespace-nowrap`}
        {...props} onMouseEnter={() => setIsModalOpen(true)} onMouseLeave={() => setIsModalOpen(false)}
      >
        {props.children}
      </Link>
      {isModalOpen &&
        createPortal(
          <DisplayModal ref={modalRef}>{getContentComponent()}</DisplayModal>,
          document.querySelector(".contentWrapper") ?? document.body 
        )
      }
    </>
  );
}