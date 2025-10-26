import ContentList, { ContentListData } from "../Components/Content/ContentList/ContentList"
import PageTitle from "../Components/Layout/Typography/PageTitle"
import {abilities, tags} from "@/../public/data/abilities.json";
import { getAbilityData } from "../Utilities/content.utility";

export default function AbilitiesLayout({
	children,
}: {
	children: React.ReactNode
}) {

  const listContent: ContentListData[] = [];
  for (const ability of abilities) {
    if (!(ability.isSub ?? false))
      listContent.push({
        name: ability.name,
        other: [ability.classes.join(", ")],
        subContent: ability.subAbilities?.flatMap((a) => {
          const subAbil = getAbilityData(a);
          if (!subAbil) return [];
          return {
            name: subAbil.name,
            other: [subAbil.classes.join(", ")],
            tags: subAbil.tags
          } as ContentListData;
        }),
        tags: ability.tags,
        isExpanded: ability.expanded ?? true
      });
  }

  return (
    <div className="w-full h-full">
      <PageTitle title="Abilities"/>
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <div className="shrink-0 w-full md:w-auto">
          <ContentList content={listContent} title="Abilities" tags={tags} options={{columns:[{name: "Ability", width: "60%", sort: true}, {name: "Source", width: "40%", sort: true}], height: "400px", width: "350px", filter: true, search: true}}/>
        </div>
        {children}
      </div>
    </div>
  )
}