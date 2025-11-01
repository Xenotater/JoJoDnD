import { PassionData } from "@/app/Models/Passions.model";
import { getFirstItem, getPassionData } from "@/app/Utilities/content.utility";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { toTitleCase } from "@/app/Utilities/misc.utility";
import PassionsContent from "../Components/PassionsContent";

export default async function Passion(props: {params: Promise<{passion: string}>}) {
  const selectedPassion = decodeURIComponent((await props.params).passion);
  const passionData: PassionData | undefined = getPassionData(selectedPassion);

  if (!passionData)
    redirect("/passions/" + (getFirstItem("Passions") as PassionData).name.toLowerCase());

  return (
    <div className="content grow h-min-[40vh]">
      <PassionsContent data={passionData}/>
    </div>
  );
}

export async function generateMetadata(props: {params: Promise<{passion: string}>}): Promise<Metadata> {
  const passionName = decodeURIComponent((await props.params).passion);
  return { title: toTitleCase(passionName) }
}