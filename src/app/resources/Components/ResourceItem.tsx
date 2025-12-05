import HTMLInclusiveText from "@/app/Components/Display/HTMLInclusiveText";
import Divider from "@/app/Components/Layout/Divider/Divider";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { ReactNode } from "react";

export default function ResourceItem({icon, title, desc, children, border}: {icon: ReactNode, title: string, desc: string[], children: ReactNode, border?: boolean}) {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <div className="h-full flex flex-col gap-2 md:flex-row md:gap-4 md:w-[70%] items-center">
          {icon}
          <div className="flex flex-col pr-6 text-center md:text-left ">
            <ContentHeading as="h2" className="md:m-0 leading-[36px]">{title}</ContentHeading>
            {desc.map((d, i) => (<HTMLInclusiveText as="span" key={`${title}-desc-${i}`} text={d}/>))}
          </div>
        </div>
        <div className="grow md:w-[30%]">
          {children}
        </div>
      </div>
      {border != false &&
        <Divider/>
      }
    </div>
  );
}