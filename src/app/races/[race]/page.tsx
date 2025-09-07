import { RaceData } from "@/app/Models/Races.model";
import { getFirstItem, getRaceData } from "@/app/Utilities/content.utility";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { toTitleCase } from "@/app/Utilities/misc.utility";
import RacesContent from "../Components/RacesContent";

export default async function Race(props: {params: Promise<{race: string}>}) {
  const selectedRace = decodeURIComponent((await props.params).race);
  const raceData: RaceData | undefined = getRaceData(selectedRace);

  if (!raceData)
    redirect("/races/" + (getFirstItem("Races") as RaceData).name.toLowerCase());

  return (
    <div className="content grow h-min-[40vh]">
      <RacesContent data={raceData}/>
    </div>
  );
}

export async function generateMetadata(props: {params: Promise<{race: string}>}): Promise<Metadata> {
  const raceName = decodeURIComponent((await props.params).race);
   return { title: toTitleCase(raceName) }
}