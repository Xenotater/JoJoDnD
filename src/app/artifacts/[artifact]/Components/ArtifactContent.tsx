import HTMLInclusiveText from "@/app/Components/Display/HTMLInclusiveText";
import { FancyImage } from "@/app/Components/FancyImage/FancyImage";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { ArtifactData } from "@/app/Models/Artifacts.model";

export default function ArtifactContent({data}: {data: ArtifactData | undefined}) {
  const cleanName = (name: string) => {
    return name.replaceAll("'", "").replaceAll(/ +/g, "_");
  }

  if (!data)
    return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>

  return (
    <div className="w-full h-full flex flex-col gap-4 mb-4">
      <ContentHeading className="underline">{data.name}</ContentHeading>
      <div className="flex flex-col items-center">
        <FancyImage type="border" className="mb-2 max-w-[80%] max-h-[40vh] w-auto" src={`/images/artifacts/${cleanName(data.name)}.webp`} alt={data.name}/>
        {data.lore &&
          <i className="text-center">{data.lore}</i>
        }
      </div>
      <div>
        <ContentHeading as="h3">Description</ContentHeading>
        <HTMLInclusiveText as="div" text={data.desc}/>
      </div>
      {data.effect &&
        <div>
          <ContentHeading as="h3">Effect</ContentHeading>
          <HTMLInclusiveText as="div" text={data.effect}/>
        </div>
      }
      {data.note &&
        <p><small><b>Note:</b> <HTMLInclusiveText as="i" text={data.note}/></small></p>
      }
      {data.other &&
        data.other.map((o) => (
          <div key={`${data.name}-${o.name}`} id={o.anchor}>
            <ContentHeading as="h3">{o.name}</ContentHeading>
            <HTMLInclusiveText as="div" text={o.content.join("")}/>
          </div>
        ))
      }
    </div>
  )
}