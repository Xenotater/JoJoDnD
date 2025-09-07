"use client";

import { MouseEvent, useRef, useState } from "react";
import DisplayModal from "./DisplayModal";
import RulesContent from "@/app/rules/Components/RulesContent";
import { getPassionData, getRaceData, getRuleContent } from "@/app/Utilities/content.utility";
import Link, { LinkProps } from "next/link";
import PassionsContent from "@/app/passions/Components/PassionsContent";
import { createPortal } from "react-dom";
import RacesContent from "@/app/races/Components/RacesContent";
import { renderToStaticMarkup } from "react-dom/server";

export default function PreviewLink(props: LinkProps & {children: React.ReactNode}) {
  const modalRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMouseOverModal, setIsMouseOverModal] = useState(false);
  const [modalPos, setModalPos] = useState([0, 0]);

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

  //create a fake version of the modal to get the size of it, and move it based on that size if it is too far on the screen to be viewed
  const translatePosition = (x: number, y: number) => {
    const modalElem = document.createElement("div");
    modalElem.innerHTML = renderToStaticMarkup(getContentComponent());
    modalElem.style.setProperty("position", "absolute");
    modalElem.style.setProperty("left", "-10000px");
    modalElem.style.setProperty("max-height", "40vh");
    modalElem.style.setProperty("max-width", "40vw");
    document.body.appendChild(modalElem);
    if (x > (window.innerWidth/2))
      x = x - (modalElem.clientWidth ?? 0) - 40;
    else
      x -= 20;
    if (y > (window.innerHeight/2))
      y = y - (modalElem.clientHeight ?? 0) + 40;
    else
      y -= 20;
    document.body.removeChild(modalElem);
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
        createPortal(
          <div ref={modalRef}><DisplayModal x={modalPos[0]} y={modalPos[1]} onMouseOver={() => setIsMouseOverModal(true)} onMouseLeave={() => {setIsModalOpen(false); setIsMouseOverModal(false)}}>
            {getContentComponent()}
          </DisplayModal></div>,
          document.querySelector(`.content:has([href='${props.href}'])`) ?? document.body
        )
      }
    </>
  );
}