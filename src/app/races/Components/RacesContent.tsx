import HTMLInclusiveText from "@/app/Components/Display/HTMLInclusiveText";
import PreviewLink from "@/app/Components/Display/PreviewLink";
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
        {data.examples && data.links && data.links.length == data.examples.length &&
          <span className="text-center">
            <b>Examples of {(data.name + 's').replace(/Mans$/g, "Men")}: </b>
            {data.examples.map((e, i) => (
              <><a key={`example-${i}`} href={`https://jojowiki.com/${data.links![i]}`} target={"_blank"}><i>{e}</i></a>{i < data.examples!.length - 1 && ", "}</>
            ))}
          </span>
        }
      </div>
      <div>
        <ContentHeading as="h3">Description</ContentHeading>
        <HTMLInclusiveText as="p" text={data.desc}/>
      </div>
      {data.playing &&
        <div>
          <ContentHeading as="h3">Playing as a{(/[AEIOU]/.test(data.name[0]) ? "n ":" ")} {data.name}</ContentHeading>
          <HTMLInclusiveText as="p" text={data.playing}/>
        </div>
      }
      {data.note &&
        <p><small><b>Note:</b> <HTMLInclusiveText as="i" text={data.note}/></small></p>
      }
      {data.changes &&
        <div>
          <ContentHeading as="h3">Changes</ContentHeading>
          <HTMLInclusiveText as="p" text={data.changes}/>
        </div>
      }
      {data.feats &&
        <div>
          <ContentHeading as="h3">Racial Features</ContentHeading>
          <ul className="list-disc">
            {data.feats.map((feat) => (
              <li key={feat}><PreviewLink href={`/abilities/${encodeURIComponent(feat)}`}>{feat}</PreviewLink></li>
            ))}
          </ul>
        </div>
      }
      {data.note2 &&
        <p><small><b>Note:</b> <HTMLInclusiveText as="i" text={data.note2}/></small></p>
      }
    </div>
  )
}