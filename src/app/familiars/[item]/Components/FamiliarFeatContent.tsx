import HTMLInclusiveText from "@/app/Components/Display/HTMLInclusiveText";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { FamiliarFeat } from "@/app/Models/Familiars.model";

export default function FamiliarFeatContent({data}: {data: FamiliarFeat}) {
  return (
    <div className="w-full h-full">
      <ContentHeading className="underline">{data.name}</ContentHeading>
      {data.desc.map((d, i) => <HTMLInclusiveText as="div" key={`${data.name}-desc-${i}`} className="mb-2" text={d}/>)}
    </div>
  );
}