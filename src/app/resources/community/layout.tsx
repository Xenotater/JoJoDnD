import PageTitle from "@/app/Components/Layout/Typography/PageTitle";
import { ReactNode } from "react";

export default function CommunityResourcesLayout({children}: {children: ReactNode}) {
  return (
    <div className="w-full h-full mb-4">
      <PageTitle title="Community Resources"/>
      <div className="content">
        <div className="flex justify-between mb-4">
          {/* options */}
          <span>These awesome resources were created by members of the JoJo D&D community!</span>
          {/* search */}
        </div>
        {children}
      </div>
    </div>    
  );
}