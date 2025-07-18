import {tabs} from '@/../public/data/rules.json';
import { RulesTabData } from '@/app/Models/Rules.model';
import { redirect } from 'next/navigation';

export default async function RulesSection({params}: {params: {category: string}}) {
  console.log((await params).category)
  const selectedCategory = decodeURIComponent((await params).category);
  console.log(selectedCategory);
  const tabData: RulesTabData | undefined = tabs.find((t) => t.title.toLowerCase() == selectedCategory.toLowerCase());

  if (!tabData)
    redirect("/rules/basics");
  
  return <>{tabData.title}</>
}