import { FamiliarClass, FamiliarFeat, FamiliarFeature, FamiliarInfo, FamiliarItemData } from "@/app/Models/Familiars.model";
import FamiliarClassContent from "./FamiliarClassContent";
import FamiliarFeatureContent from "./FamiliarFeatureContent";
import FamiliarFeatContent from "./FamiliarFeatContent";
import FamiliarInfoContent from "./FamiliarInfoContent";

export default function FamiliarsContent({data}: {data: FamiliarItemData | undefined}) {
  if (!data)
    return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>
  if ((data as FamiliarInfo).content)
    return <FamiliarInfoContent data={data as FamiliarInfo}/>
  if ((data as FamiliarClass).levels)
    return <FamiliarClassContent data={data as FamiliarClass}/>
  if ((data as FamiliarFeature).classes)
    return <FamiliarFeatureContent data={data as FamiliarFeature}/>
  if ((data as FamiliarFeat).desc)
    return <FamiliarFeatContent data={data as FamiliarFeat}/>
  return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>
}