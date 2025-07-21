"use client";

import { MouseEvent, useState } from "react";
import DisplayModal from "./DisplayModal";
import RulesContent from "@/app/rules/Components/RulesContent";
import { getRuleContent } from "@/app/Utilities/content.utility";
import Link, { LinkProps } from "next/link";

export default function PreviewLink(props: LinkProps & {children: React.ReactNode}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMouseOverModal, setIsMouseOverModal] = useState(false);
  const [modalPos, setModalPos] = useState([0, 0]);

  const getContentComponent = () => {
    const path = props.href?.toString().split("/");
    switch(path[1]) {
      case "rules":
        return <RulesContent data={getRuleContent(decodeURIComponent(path[2]))}/>
      default:
        return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>
    }
  }

  const translatePosition = (x: number, y: number) => {
    if (x > (window.innerWidth/2))
      x = window.innerWidth/2 - 100;
    else
      x -= 20;
    if (y > (window.innerHeight/2))
      y = window.innerHeight/2 - 100;
    return [x, y];
  }

  return (
    <>
      <Link className={`${isModalOpen || isMouseOverModal ? "z-101 border rounded-xs border-[purple] bg-jj-mpurple-1 shadow-black shadow-xs" : ""} text-[purple] underline relative`}
        {...props} onMouseEnter={(e: MouseEvent) => {setIsModalOpen(true); setModalPos(translatePosition(e.pageX, e.pageY))}}
        onMouseLeave={() => setTimeout(() => setIsModalOpen(false), 100)}
      >
        {props.children}
      </Link>
      {(isModalOpen || isMouseOverModal) &&
        <DisplayModal x={modalPos[0]} y={modalPos[1]} onMouseOver={() => setIsMouseOverModal(true)} onMouseLeave={() => {setIsModalOpen(false); setIsMouseOverModal(false)}}>
          {getContentComponent()}
        </DisplayModal>
      }
    </>
  )
}