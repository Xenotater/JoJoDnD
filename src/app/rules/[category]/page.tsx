import { RulesTabData } from '@/app/Models/Rules.model';
import { redirect } from 'next/navigation';
import RulesContent from '../Components/RulesContent';
import { getRuleContent } from '@/app/Utilities/content.utility';

export default async function RulesSection({params}: {params: {category: string}}) {
  const selectedCategory = decodeURIComponent((await params).category);
  const tabData: RulesTabData | undefined = getRuleContent(selectedCategory);

  if (!tabData)
    redirect("/rules/basics");
  
  return (
    <RulesContent data={tabData}/>
  )
}