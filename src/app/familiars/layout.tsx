import ContentList, { ContentListData } from "../Components/Content/ContentList/ContentList";
import PageTitle from "../Components/Layout/Typography/PageTitle";
import {categories} from "@/../public/data/familiars.json";

export default function FamiliarsLayout({
	children,
}: {
	children: React.ReactNode
}) {

  const listContent: ContentListData[] = [];
  listContent.push({
    name: "Familiars",
    altLink: ""
  });
  listContent.push({
    name: "Classes",
    subContent: categories.classes.map((c) => ({
      name: c.name
    })),
    isLink: false,
    isExpanded: true
  });
  listContent.push({
    name: "Features",
    subContent: categories.features.map((c) => ({
      name: c.name
    })),
    isLink: false,
    isExpanded: false
  });
  listContent.push({
    name: "Feats",
    subContent: categories.feats.map((c) => ({
      name: c.name
    })),
    isLink: false,
    isExpanded: false
  });
  

  return (
    <div className="w-full h-full">
      <PageTitle title="Familiars"/>
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <div className="shrink-0 w-full md:w-auto">
          <ContentList content={listContent} options={{columns:[{name: "Familiars"}], height: "500px", width: "250px", search: true}}/>
        </div>
        {children}
      </div>
    </div>
  )
}

export const metadata = {
  title: "Familiars",
  description: "Unique familiars for JoJo's Bizarre Tabletop Game"
}