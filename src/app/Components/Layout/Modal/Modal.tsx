"use client";

import React, { ReactElement } from "react";
import { useEffect, useRef } from "react";

interface ModalProps {
  children: ReactElement | ReactElement[];
  className?: string;
  closeCallback: () => void;
  fullPage?: boolean
}

export default function Modal(props: ModalProps) {
  const innerRef = useRef(null);

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (innerRef.current && !(innerRef.current as Element).contains(event.target as Node)) {
        props.closeCallback();
        document.body.removeEventListener("click", handleClick, true);
      }
    }
      document.body.addEventListener("click", handleClick, true);
  }, [innerRef])
  
  return (
    <>
      <div className={`fixed top-0 left-0 h-full w-full z-100 pointer-events-none ${props.className}`}>
        {props.fullPage && ((props.children as ReactElement[]).length ?
          <div ref={innerRef} className="pointer-events-auto">{props.children}</div>
          : React.cloneElement(props.children as ReactElement, {ref: innerRef, className: "pointer-events-auto " + (props.children as ReactElement).props?.className}))
        }
      </div>
      {!props.fullPage && ((props.children as ReactElement[]).length ?
        <div ref={innerRef}>{props.children}</div>
        : React.cloneElement(props.children as ReactElement, {ref: innerRef, className: "z-101 " + (props.children as ReactElement).props?.className}))
      }
    </>
  );
}