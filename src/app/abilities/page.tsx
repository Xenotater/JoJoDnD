import { redirect } from "next/navigation";
import { getFirstItem } from "../Utilities/content.utility";
import { AbilityData } from "../Models/Abilities.model";

//abiltiies stub page, no content, redirect to subcategory page
export default function AbilitiesStub() {
  redirect("/abilities/" + encodeURIComponent((getFirstItem("Abilities", "name") as AbilityData).name.toLowerCase()));
}

export const metadata = {
  title: "Abilities",
  description: "Unique abilities for JoJo's Bizarre Tabletop Game"
}