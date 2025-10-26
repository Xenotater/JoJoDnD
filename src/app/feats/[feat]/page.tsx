import { FeatData } from "@/app/Models/Feats.model";
import { getFirstItem, getFeatData } from "@/app/Utilities/content.utility";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { toTitleCase } from "@/app/Utilities/misc.utility";
import FeatsContent from "../Components/FeatsContent";

export default async function FeatPage(props: {params: Promise<{feat: string}>}) {
  const selectedFeat = decodeURIComponent((await props.params).feat);
  const featData: FeatData | undefined = getFeatData(selectedFeat);

  if (!featData)
    redirect("/feats/" + (getFirstItem("Feats", "name") as FeatData).name.toLowerCase());

  if (featData.subFeats)
    redirect("/feats/" + featData.subFeats[0]);

  return (
    <div className="content grow h-min-[40vh]">
      <FeatsContent data={featData}/>
    </div>
  );
}

export async function generateMetadata(props: {params: Promise<{feat: string}>}): Promise<Metadata> {
  const featName = decodeURIComponent((await props.params).feat);
   return { title: toTitleCase(featName) }
}