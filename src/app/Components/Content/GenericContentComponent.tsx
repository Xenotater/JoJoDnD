import AbilitiesContent from "@/app/abilities/Components/AbilitiesContent";
import ArtifactContent from "@/app/artifacts/[artifact]/Components/ArtifactContent";
import FamiliarsContent from "@/app/familiars/[item]/Components/FamiliarsContent";
import FeatsContent from "@/app/feats/Components/FeatsContent";
import PassionsContent from "@/app/passions/Components/PassionsContent";
import RacesContent from "@/app/races/Components/RacesContent";
import RulesContent from "@/app/rules/Components/RulesContent";
import { getAbilityData, getArtifactData, getFamiliarData, getFeatData, getPassionData, getRaceData, getRuleContent, getWeaponData } from "@/app/Utilities/content.utility";
import AttributesList from "@/app/weapons/Components/AttributesList";
import WeaponContentItem from "@/app/weapons/Components/WeaponContentItem";

export default function GenericContentComponent({page, item}: {page: string, item: string}) { 
  const getContentComponent = () => {
    if (page == "weapons" && item == "attributes")
      page = "attributes"
    switch(page) {
      case "rules":
        return <RulesContent data={getRuleContent(item)}/>;
      case "passions":
        return <PassionsContent data={getPassionData(item)}/>;
      case "races":
        return <RacesContent data={getRaceData(item)}/>;
      case "familiars":
        return <FamiliarsContent data={getFamiliarData(item)}/>;
      case "abilities":
        return <AbilitiesContent data={getAbilityData(item)}/>;
      case "feats":
        return <FeatsContent data={getFeatData(item)}/>;
      case "weapons":
        return <WeaponContentItem data={getWeaponData(item)}/>;
      case "artifacts":
        return <ArtifactContent data={getArtifactData(item)}/>;
      case "attributes":
        return <AttributesList/>
      default:
        return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>;
    }
  }

  return getContentComponent();
}