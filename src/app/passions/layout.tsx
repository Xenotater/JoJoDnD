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
      <ContentList content={listContent} title="Passions" options={{columns:[{name: "Passion", width: "48%", sort: true}, {name: "Ability", width: "52%", sort: true}], height: "400px", width: "350px", filter: true, search: true}}/>
      {children}
    </div>
  )
}