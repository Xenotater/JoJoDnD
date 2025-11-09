import ContentList, { ContentListData } from "../Components/Content/ContentList/ContentList"
import PreviewLink from "../Components/Display/PreviewLink";
import ContentHeading from "../Components/Layout/Typography/ContentHeading";
import PageTitle from "../Components/Layout/Typography/PageTitle"
import {classes} from "@/../public/data/classes.json";

export default function RacesLayout({
	children,
}: {
	children: React.ReactNode
}) {

  const listContent: ContentListData[] = [];
  classes.forEach((c) => {
    listContent.push({
      name: c.name,
      subContent: c.subTypes?.map((s) => ({
        name: s.name
      }))
    });
  });
  listContent.sort((a, b) => a.name == "Stands" ? -1 : b.name == "Stands" ? 1 : 0); //put Stands at top of list
  listContent[0].isExpanded = true;


  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageTitle title="Classes"/>
      <div className="flex flex-col md:flex-row gap-4 items-center md:ml-4 md:mr-4">
        <div className="content text-center flex flex-col gap-2">
          <ContentHeading as={"h5"} className="underline">Class Variants</ContentHeading>
          <p>There are three variants of each class. The Standard version, a more Modular version with more flexability, and an Abridged version that&apos;s simpler and tougher.</p>
          <p>Players should typically use the Standard variant, unless directed otherwise by their DM.</p>
        </div>
        <div className="content text-center flex flex-col gap-2">
          <ContentHeading as={"h5"} className="underline">Multiclassing</ContentHeading>
          <p>
            You may choose to gain levels in more than one of these Classes, but can only level up in one at a time. For example, you may become a Ripple User that also has a Stand, but you&apos;ll need to choose which Class to gain in for each Level-Up.
            <br/><PreviewLink href='/races'>Races</PreviewLink> with levels do not have this restriction, and their levels work differently. Check the respective Race page for details.
            <br/>You may not multiclass into two different Stand Types, but may instead utilize Multi-Typing which is defined with the other <a href='/classes/Stands#multi-type'>Stand rules</a>.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <div className="shrink-0 w-full md:w-auto">
          <ContentList content={listContent} title="Classes" options={{width: "200px"}}/>
        </div>
        {children}
      </div>
    </div>
  )
}