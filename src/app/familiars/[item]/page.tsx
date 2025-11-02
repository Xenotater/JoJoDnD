import { FamiliarItemData } from "@/app/Models/Familiars.model";
import { getFamiliarData } from "@/app/Utilities/content.utility";
import {categories} from "@/../public/data/familiars.json";
import { redirect } from "next/navigation";
import FamiliarsContent from "./Components/FamiliarsContent";

export default async function FamiliarItem(props: {params: Promise<{item: string}>}) {
  const selectedItem = decodeURIComponent((await props.params).item);
  const itemData: FamiliarItemData | undefined = getFamiliarData(selectedItem);

  if (selectedItem.toLowerCase() == "classes")
    redirect("/familiars/" + categories.classes[0].name);
  if (selectedItem.toLowerCase() == "features")
    redirect("/familiars/" + categories.features[0].name);
  if (selectedItem.toLowerCase() == "feats")
    redirect("/familiars/" + categories.feats[0].name);

  if (!itemData)
    redirect("/familiars/");

  return (
    <div className="content grow min-h-[40vh]">
      <FamiliarsContent data={itemData}/>
    </div>
  );
}