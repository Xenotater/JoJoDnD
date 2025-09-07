import HTMLInclusiveText from "@/app/Components/Display/HTMLInclusiveText";
import { FancyImage } from "@/app/Components/FancyImage/FancyImage";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { RaceData } from "@/app/Models/Races.model";

export default function RacesContent({data}: {data: RaceData | undefined}) {
  if (!data)
    return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>

  return (
    <div className="w-full h-full flex flex-col gap-4 mb-4">
      <ContentHeading className="underline">{data.name}</ContentHeading>
      <div className="flex flex-col items-center">
        <FancyImage className="mb-2 max-w-[80%] w-auto" src={`/races/${data.name.replaceAll("/", "").replaceAll(/ +/g, "_")}.webp`} type={"border"} alt={data.name}/>
      </div>
      <div>
        <ContentHeading as="h3">Description</ContentHeading>
        <HTMLInclusiveText as="p" text={data.desc}/>
      </div>
      {data.playing &&
        <div>
          <ContentHeading as="h3">Playing as a {data.name}</ContentHeading>
          <HTMLInclusiveText as="p" text={data.playing}/>
        </div>
      }
    </div>
  )
}