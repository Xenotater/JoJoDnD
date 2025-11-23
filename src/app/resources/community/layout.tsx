import PageTitle from "@/app/Components/Layout/Typography/PageTitle";
import { ReactNode } from "react";
import ResourceSearch from "./Components/ResourceSearch";
import CommunityMenu from "./Components/CommunityMenu";

export default function CommunityResourcesLayout({children}: {children: ReactNode}) {
  return (
    <div className="w-full h-full mb-4">
      <PageTitle title="Community Resources"/>
      <div className="content relative">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4 md:items-center">
          <CommunityMenu/>
          <span className="text-lg text-center md:text-left md:max-w-[calc(100%-250px)]">These awesome resources were created by members of the JoJo D&D community!</span>
          <ResourceSearch/>
        </div>
        {children}
      </div>
    </div>    
  );
}