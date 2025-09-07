import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import HTMLInclusiveText from "@/app/Components/Display/HTMLInclusiveText";
import { RulesTabData } from "@/app/Models/Rules.model";

export default function RulesContent({data}: {data: RulesTabData | undefined}) {
  if (!data)
    return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>

  return (
    <div className="h-full w-full">
      <div className="p-2 lg:p-8 pt-2">
        <ContentHeading className="text-center underline mb-0">{data.title}</ContentHeading>
        {data.sections.map((section, i) => (
          <div key={section.heading + i}>
            <ContentHeading as="h3" className="mb-2 mt-6"><b>{section.heading}</b></ContentHeading>
            {section.items.map((item, i) => (
              <div key={item.subheading + i}>
                <h4 className="underline mt-2"><b>{item.subheading}</b></h4>
                {item.details.map((detail, i) => (
                  <HTMLInclusiveText as="p" className="indent-4" key={item.subheading + "-detail-" + i} text={detail}/>
                ))}
                {item.compactDetails && 
                  <div className="mt-2">
                    {item.compactDetails.map((compact, i) => (
                      <HTMLInclusiveText as="p" className="leading-4 mb-1" key={item.subheading + "-compact-" + i} text={compact}/>
                    ))}
                  </div>
                }
                {item.other &&
                  <div> 
                    {item.other.map((other, i) => (
                      <HTMLInclusiveText as="div" className="w-full" key={item.subheading + "-other-" + i} text={other}/>
                    ))}
                  </div>
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}