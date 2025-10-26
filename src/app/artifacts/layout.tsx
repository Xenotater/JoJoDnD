import ContentList, { ContentListData } from "../Components/Content/ContentList/ContentList"
import PageTitle from "../Components/Layout/Typography/PageTitle"
import {artifacts} from "@/../public/data/artifacts.json";

export default function ArtifactsLayout({
	children,
}: {
	children: React.ReactNode
}) {

  const listContent: ContentListData[] = [];
  for (const artifact of artifacts) {
    listContent.push({
      name: artifact.name
    });
  }

  return (
    <div className="w-full h-full">
      <PageTitle title="Artifacts"/>
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <div className="shrink-0 w-full md:w-auto">
          <ContentList content={listContent} title="Artifacts" options={{width: "200px"}}/>
        </div>
        {children}
      </div>
    </div>
  )
}