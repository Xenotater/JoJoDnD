import ContentList, { ContentListData } from "../Components/Content/ContentList/ContentList"
import PageTitle from "../Components/Layout/Typography/PageTitle"
import {feats, tags} from "@/../public/data/feats.json";
import { getFeatData } from "../Utilities/content.utility";

export default function FeatsLayout({
	children,
}: {
	children: React.ReactNode
}) {

  const listContent: ContentListData[] = [];
  for (const feat of feats) {
    if (!(feat.isSub ?? false))
      listContent.push({
        name: feat.name,
        subContent: feat.subFeats?.flatMap((f) => {
                const subFeat = getFeatData(f);
                if (!subFeat) return [];
                return {
                  name: subFeat.name,
                  tags: subFeat.tags
                } as ContentListData;
              }),
        tags: feat.tags,
        isExpanded: feat.expanded ?? true,
        isLink: !feat.subFeats
      });
  }

  return (
    <div className="w-full h-full">
      <PageTitle title="Feats"/>
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <div className="shrink-0 w-full md:w-auto">
          <ContentList content={listContent} tags={tags} options={{columns:[{name: "Feats", sort: true}], height: "400px", width: "350px", filter: true, search: true}}/>
        </div>
        {children}
      </div>
    </div>
  )
}