"use client";

import React, { JSX, ReactElement, ReactNode } from "react";
import { useEffect, useRef } from "react";

interface ModalProps {
  children: ReactElement;
  className?: string;
  closeCallback: () => void;
  fullPage?: boolean;
  blur?: boolean;
}

export default function Modal(props: ModalProps) {
  const innerRef = useRef<Element>(null);

  const child = React.Children.map<ReactNode, ReactNode>(props.children, child => {
    if (React.isValidElement(child))
      return React.cloneElement(child as JSX.Element, {...(child.props as object), ref: innerRef, className: "pointer-events-auto " + (child.props as {className?: string}).className})
  });

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (innerRef.current && !innerRef.current.contains(event.target as Node))
        props.closeCallback();
    }

    document.body.addEventListener("mousedown", handleClick, true);

    return (() => document.body.removeEventListener("mousedown", handleClick, true));
  }, [])
  
  return (
    <>
      <div className={`fixed top-0 left-0 h-full w-full z-100 pointer-events-none ${props.fullPage ? "flex justify-center items-center pt-(--headerHeight)" : ""} ${props.blur ? "bg-white/30" : ""} ${props.className}`}>
        {props.fullPage && child}
      </div>
      {!props.fullPage && child}
    </>
  );
}