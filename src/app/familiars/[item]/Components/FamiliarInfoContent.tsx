import HTMLInclusiveText from "@/app/Components/Display/HTMLInclusiveText";
import { FancyImage } from "@/app/Components/FancyImage/FancyImage";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { FamiliarInfo } from "@/app/Models/Familiars.model";

import styles from "./FamiliarsContent.module.css";

export default function FamiliarInfoContent({data}: {data: FamiliarInfo}) {
  return (
    <div className="w-full h-full flex flex-col gap-4 mb-4">
      <ContentHeading className="underline mb-0">{data.name}</ContentHeading>
      <FancyImage type="border" className="max-w-[90%] w-auto m-auto" src={`/familiars/${data.img}.webp`} alt={data.name}/>
      <div>
        <ContentHeading as="h3">Description</ContentHeading>
        <p>{data.desc}</p>
      </div>
      {
        data.content.map((c) => (
          <div className={styles.infoContent} key={`familiars-${c.name.replace(" ", "-")}`}>
            <ContentHeading as="h3">{c.name}</ContentHeading>
            {c.content.map((subC, i) => (
              <HTMLInclusiveText key={`familiars-${c.name.replace(" ", "-")}-sub-${i}`} as="div" text={subC}/>
            ))}
          </div>
        ))
      }
    </div>
  );
}