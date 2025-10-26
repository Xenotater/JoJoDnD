import { redirect } from "next/navigation";
import { getFirstItem } from "../Utilities/content.utility";
import { FeatData } from "../Models/Feats.model";

//feats stub page, no content, redirect to subcategory page
export default function FeatsStub() {
  redirect("/feats/" + encodeURIComponent((getFirstItem("Feats", "name") as FeatData).name.toLowerCase()));
}


export const metadata = {
  title: "Feats",
  description: "Unique feats for JoJo's Bizarre Tabletop Game"
}