import { AbilityData } from "@/app/Models/Abilities.model";
import { getFirstItem, getAbilityData } from "@/app/Utilities/content.utility";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { toTitleCase } from "@/app/Utilities/misc.utility";
import AbilitiesContent from "../Components/AbilitiesContent";

export default async function AbilityPage(props: {params: Promise<{ability: string}>}) {
  const selectedAbility = decodeURIComponent((await props.params).ability);
  const abilityData: AbilityData | undefined = getAbilityData(selectedAbility);

  if (!abilityData)
    redirect("/abilities/" + (getFirstItem("Abilities", "name") as AbilityData).name.toLowerCase());

  return (
    <div className="content grow h-min-[40vh]">
      <AbilitiesContent data={abilityData}/>
    </div>
  );
}

export async function generateMetadata(props: {params: Promise<{ability: string}>}): Promise<Metadata> {
  const abilityName = decodeURIComponent((await props.params).ability);
   return { title: toTitleCase(abilityName) }
}