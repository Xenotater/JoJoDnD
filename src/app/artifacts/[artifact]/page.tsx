import { getArtifactData, getFirstItem } from "@/app/Utilities/content.utility";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { toTitleCase } from "@/app/Utilities/misc.utility";
import ArtifactsContent from "./Components/ArtifactContent";
import { ArtifactData } from "@/app/Models/Artifacts.model";

export default async function Race(props: {params: Promise<{artifact: string}>}) {
  const selectedArtifact = decodeURIComponent((await props.params).artifact);
  const artifactData: ArtifactData | undefined = getArtifactData(selectedArtifact);

  if (!artifactData)
    redirect("/artifacts/" + (getFirstItem("Artifacts") as ArtifactData).name.toLowerCase());

  return (
    <div className="content grow h-min-[40vh]">
      <ArtifactsContent data={artifactData}/>
    </div>
  );
}

export async function generateMetadata(props: {params: Promise<{artifact: string}>}): Promise<Metadata> {
  const artifactName = decodeURIComponent((await props.params).artifact);
   return { title: toTitleCase(artifactName) }
}