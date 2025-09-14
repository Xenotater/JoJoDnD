import { HTMLAttributes } from "react";

export default function DisplayModal(props: HTMLAttributes<HTMLDivElement> & {xOffset?: number, yOffset?: number, hideMobile?: boolean, children: React.ReactNode, ref?: React.Ref<HTMLDivElement>}) {
  const domProps = {...props};
  delete domProps.xOffset;
  delete domProps.yOffset;
  delete domProps.hideMobile;
  delete domProps.children;

  return (
    <div {...domProps} style={{"--xoffset": `${props.xOffset ?? 0}px`, "--yoffset": `${props.yOffset ?? 0}px`, ...props.style} as React.CSSProperties}
        className={`${props.className} fixed top-[calc(var(--yoffset))] right-(--xoffset) max-h-[40vh] max-w-[40vw] z-1000 ${props.hideMobile ? "hidden md:block" : ""}`}>
      <div className={`content ${!props.xOffset ? "rounded-r-none" : ""} ${!props.yOffset ? "rounded-t-none" : ""}
          max-h-[inherit] overflow-y-scroll shadow-black shadow-lg indent-0`}>
        <div className="min-w-fit">{props.children}</div>
      </div>
    </div>
  );
}