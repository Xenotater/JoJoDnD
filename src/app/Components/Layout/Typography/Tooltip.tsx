"use client";

import { JSX, useState } from "react";

export default function Tooltip(props: {label: string, children: JSX.Element | string}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState([0, 0]);

  const updatePos = (x: number, y: number) => {
    const text: string = props.children.toString();
    x -= 20; y -= text.length / 2.25 + 45;
    if (x > window.innerWidth / 2)
      x -= text.length;
    setTooltipPos([x, y]);
  }

  return (
    <>
      <span className="underline underline-offset-2 decoration-dashed decoration-1" onMouseEnter={(e) => {setTooltipOpen(true); updatePos(e.pageX, e.pageY)}}
          onMouseLeave={() => setTooltipOpen(false)} onClick={(e) => {setTooltipOpen(tooltipOpen); updatePos(e.pageX, e.pageY)}}>
            {props.label}
      </span>
      {tooltipOpen &&
        <div className="fixed shadow-md border bg-yellow-200 p-2 top-(--yoffset) left-(--xoffset) max-w-[30vw] z-100" style={{"--xoffset": `${tooltipPos[0]}px`, "--yoffset": `${tooltipPos[1]}px`} as React.CSSProperties}>
          {props.children}
        </div>
      }
    </>
  )
}