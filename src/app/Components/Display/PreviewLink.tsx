"use client";

import { useEffect, useRef, useState } from "react";
import DisplayModal from "./DisplayModal";
import Link, { LinkProps } from "next/link";
import { createPortal } from "react-dom";
import GenericContentComponent from "../Content/GenericContentComponent";

export default function PreviewLink(props: LinkProps & {children: React.ReactNode}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const path = props.href?.toString().split(/[\/\#\?]/);

  //steal scroll over this element to modal content
  useEffect(() => {
    const link = linkRef.current;

    const handleScroll = (e: WheelEvent) => {
      if (isModalOpen) {
        const modal = modalRef.current;
        if (modal) {
          e.preventDefault();
          if (e.shiftKey) {
            modal.children[0].scrollTop += e.deltaX;
            modal.children[0].scrollLeft += e.deltaY;
          }
          else {
            modal.children[0].scrollTop += e.deltaY;
            modal.children[0].scrollLeft += e.deltaX;
          }
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
          <DisplayModal ref={modalRef} hideMobile={true}><GenericContentComponent page={path[1]} item={decodeURIComponent(path[2])}/></DisplayModal>,
          document.querySelector("#siteHeader")!
        )
      }
    </>
  );
}