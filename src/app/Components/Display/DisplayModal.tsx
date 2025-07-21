import { HTMLAttributes } from "react";

export default function DisplayModal(props: HTMLAttributes<HTMLDivElement> & {x: number, y: number, children: React.ReactNode}) {
  return (
    <div {...props} style={{"--xPos": `${props.x}px`, "--yPos": `${props.y}px`, ...props.style}} className={`absolute top-(--yPos) left-(--xPos) max-h-[40vh] max-w-[30vw] z-100`}>
      <div className="content max-h-[40vh] overflow-y-scroll shadow-black shadow-2xl">{props.children}</div>
    </div>
  )
}