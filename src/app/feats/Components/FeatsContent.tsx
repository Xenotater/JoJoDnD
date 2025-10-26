import HTMLInclusiveText from "@/app/Components/Display/HTMLInclusiveText";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { FeatData } from "@/app/Models/Feats.model";

export default function FeatsContent({data}: {data: FeatData | undefined}) {
  if (!data)
    return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <ContentHeading className="underline mb-0">{data.name}</ContentHeading>
      {data.prereq &&  
        <div><b><u>Prerequisite</u>: <HTMLInclusiveText as="span" text={data.prereq}/></b></div>
      }
      {data.desc &&
        <div>
          <b>Description:</b><br/><HTMLInclusiveText as="span" text={data.desc}/>
        </div>
      }
      {data.effects.length > 0 &&
        <div>
          <b>Effects:</b><br/>
          <ul className="list-disc">
            {data.effects.map((d, i) => (<HTMLInclusiveText as="li" text={d} key={`${data.name}-desc-${i}`}/>))}
          </ul>
        </div>
      }
      {data.subFeats &&
        <div>
          <ul className="list-disc">
            {data.subFeats.map((s) => <li key={`${data.name}-sub-${s}`}><a href={`/feats/${s}`}>{s}</a></li>)}
          </ul>
        </div>
      }
    </div>
  )
}