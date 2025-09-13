import PassionsContent from "@/app/passions/Components/PassionsContent";
import RacesContent from "@/app/races/Components/RacesContent";
import RulesContent from "@/app/rules/Components/RulesContent";
import { getPassionData, getRaceData, getRuleContent } from "@/app/Utilities/content.utility";

export default function GenericContentComponent({page, item}: {page: string, item: string}) {  
  const getContentComponent = () => {
    switch(page) {
      case "rules":
        return <RulesContent data={getRuleContent(item)}/>;
      case "passions":
        return <PassionsContent data={getPassionData(item)}/>;
      case "races":
        return <RacesContent data={getRaceData(item)}/>;
      default:
        return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>;
    }
  }

  return getContentComponent();
}