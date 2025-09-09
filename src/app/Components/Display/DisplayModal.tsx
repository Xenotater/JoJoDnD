import { HTMLAttributes } from "react";

export default function DisplayModal(props: HTMLAttributes<HTMLDivElement> & {xOffset?: number, yOffset?: number, children: React.ReactNode, ref: React.Ref<HTMLDivElement>}) {
  return (
    <div {...props} style={{"--xOffset": `${props.xOffset ?? 0}px`, "--yOffset": `${props.yOffset ?? 0}px`, ...props.style} as React.CSSProperties}
        className={`fixed top-[calc(var(--yOffset)+var(--headerHeight))] right-(--xOffset) max-h-[40vh] max-w-[40vw] z-100 hidden md:block`}>
      <div className={`content ${!props.xOffset ? "rounded-r-none" : ""} ${!props.yOffset ? "rounded-t-none" : ""}
          max-h-[40vh] overflow-y-scroll shadow-black shadow-lg indent-0`}>
        <div className="min-w-fit">{props.children}</div>
      </div>
    </div>
  );
}