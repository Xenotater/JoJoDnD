import { RulesTabData } from "@/app/Models/Rules.model";
import { redirect } from "next/navigation";
import RulesContent from "../Components/RulesContent";
import { getRuleContent } from "@/app/Utilities/content.utility";

export default async function RulesSection(props: {params: Promise<{category: string}>}) {
  const selectedCategory = decodeURIComponent((await props.params).category);
  const tabData: RulesTabData | undefined = getRuleContent(selectedCategory);

  if (!tabData)
    redirect("/rules/basics");
  
  return (
    <RulesContent data={tabData}/>
  );
}