import { RaceData } from "@/app/Models/Races.model";
import { getFirstItem } from "@/app/Utilities/content.utility";
import { redirect } from "next/navigation";

//races stub page, no content, redirect to subcategory page
export default function RacesStub() {
  redirect("/races/" + encodeURIComponent((getFirstItem("Races") as RaceData).name.toLowerCase()));
}

export const metadata = {
  title: "Races",
  description: "Unique races for JoJo's Bizarre Tabletop Game"
}