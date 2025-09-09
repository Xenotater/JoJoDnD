import ContentList, { ContentListData } from "../Components/ContentList/ContentList"
import PageTitle from "../Components/Layout/Typography/PageTitle"
import {passions} from "@/../public/data/passions.json";

export default function PassionsLayout({
	children,
}: {
	children: React.ReactNode
}) {

  const listContent: ContentListData[] = [];
  for (const passion of passions) {
    listContent.push({
      name: passion.name,
      other: [passion.stats],
      tags: passion.tags
    });
  }

  return (
    <div className="w-full h-full">
      <PageTitle title="Passions"/>
      <div className="content text-center mb-4">
        <h4 className="mb-1"><b><u>The World of JoJo&apos;s</u></b></h4>
        <p>JoJo&apos;s Bizarre Adventure typically takes place in a modern world filled almost completely with Humans. Passions add variety when building a character.</p>
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <div className="shrink-0 w-full">
          <ContentList content={listContent} title="Passions" options={{columns:[{name: "Passion", width: "47%", sort: true}, {name: "Ability", width: "53%", sort: true}], height: "400px", width: "350px", filter: true, search: true}}/>
        </div>
        {children}
      </div>
    </div>
  )
}