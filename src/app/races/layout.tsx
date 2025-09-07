import ContentList, { ContentListData } from "../Components/ContentList/ContentList"
import PageTitle from "../Components/Layout/Typography/PageTitle"
import {races} from "@/../public/data/races.json";

export default function RacesLayout({
	children,
}: {
	children: React.ReactNode
}) {

  const listContent: ContentListData[] = [];
  const playerRaces = races.filter((r) => r.isPlayerRace);
  const npcRaces = races.filter((r) => !r.isPlayerRace);
  listContent.push({
    name: "Player Races",
    subContent: playerRaces.map((r) => ({
      name: r.name
    })),
    isExpanded: true,
    isLink: false
  });
  listContent.push({
    name: "NPC Races",
    subContent: npcRaces.map((r) => ({
      name: r.name
    })),
    isExpanded: true,
    isLink: false
  });

  return (
    <div className="w-full h-full">
      <PageTitle title="Races"/>
      <div className="content text-center mb-4">
        <h4 className="mb-1"><b><u>Keep in Mind</u></b></h4>
        <p>Most characters in the world of JoJo&apos;s are Human, but more exotic Races can occasionally be found.</p>
        <p>Races under the &quot;NPC Races&quot; label aren&apos;t balanced for players, generally being much weaker or stronger than the Player Races, but can still technically be played by players at the DM&apos;s discretion.</p>
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <div className="shrink-0 w-full md:w-auto">
          <ContentList content={listContent} title="Races" options={{width: "200px"}}/>
        </div>
        {children}
      </div>
    </div>
  )
}