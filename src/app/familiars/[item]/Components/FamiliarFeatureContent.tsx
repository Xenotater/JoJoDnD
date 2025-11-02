import HTMLInclusiveText from "@/app/Components/Display/HTMLInclusiveText";
import PreviewLink from "@/app/Components/Display/PreviewLink";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { FamiliarFeature } from "@/app/Models/Familiars.model";

export default function FamiliarFeatureContent({data}: {data: FamiliarFeature}) {
  return (
    <div className="w-full h-full flex flex-col justify-between mb-4">
      <div>
        <ContentHeading className="underline">{data.name}</ContentHeading>
        {data.desc.map((d, i) => <HTMLInclusiveText as="div" key={`${data.name}-desc-${i}`} className="mb-2" text={d}/>)}
      </div>
      <div className="min-h-[30%]">
        <ContentHeading as="h3">Given To</ContentHeading>
        <ol className="list-disc">
          {data.classes.map((c) => <li key={`${data.name}-given-${c.replace(" ", "-")}`}><PreviewLink href={`/familiars/The ${c}`}>The {c}</PreviewLink></li>)}
        </ol>
      </div>
    </div>
  );
}