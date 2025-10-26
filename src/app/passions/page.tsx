import { redirect } from "next/navigation";
import { getFirstItem } from "../Utilities/content.utility";
import { PassionData } from "../Models/Passions.model";

//passions stub page, no content, redirect to subcategory page
export default function PassionsStub() {
  redirect("/passions/" + encodeURIComponent((getFirstItem("Passions") as PassionData).name.toLowerCase()));
}

export const metadata = {
  title: "Passions",
  description: "Unique passions for JoJo's Bizarre Tabletop Game"
}