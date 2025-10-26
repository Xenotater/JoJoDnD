import { getFirstItem } from "@/app/Utilities/content.utility";
import { redirect } from "next/navigation";
import { ArtifactData } from "../Models/Artifacts.model";

//races stub page, no content, redirect to subcategory page
export default function ArtifactsStub() {
  redirect("/artifacts/" + encodeURIComponent((getFirstItem("Artifacts") as ArtifactData).name.toLowerCase()));
}
export const metadata = {
  title: "Artifacts",
  description: "Unique artifacts for JoJo's Bizarre Tabletop Game"
}