"use client";

import React, { JSX, ReactNode } from "react";
import { useEffect, useRef } from "react";

interface ModalProps {
  children: ReactNode;
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
        {props.fullPage && React.Children.map<ReactNode, ReactNode>(props.children, child => {
          if (React.isValidElement(child))
            return React.cloneElement(child as JSX.Element, {...(child.props as object), ref: innerRef, className: "pointer-events-auto " + (child.props as {className?: string}).className})
        })
        }
      </div>
      {!props.fullPage && React.Children.map<ReactNode, ReactNode>(props.children, child => {
          if (React.isValidElement(child))
            return React.cloneElement(child as JSX.Element, {...(child.props as object), ref: innerRef, className: "pointer-events-auto " + (child.props as {className?: string}).className})
        })
      }
    </>
  );
}