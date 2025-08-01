import { PassionData } from "@/app/Models/Passions.model";
import { getFirstItem, getPassionData } from "@/app/Utilities/content.utility";
import { redirect } from "next/navigation";

export default async function Passion(props: {params: Promise<{passion: string}>}) {
  const selectedPassion = decodeURIComponent((await props.params).passion);
  const passionData: PassionData | undefined = getPassionData(selectedPassion);

  if (!passionData)
    redirect("/passions/" + (getFirstItem("Passions") as PassionData).name.toLowerCase());

  return (
    <>
    <h3>{passionData.name}</h3>
    <div className="h-[500px]"></div>
    </>
  );
}