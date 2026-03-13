import PageTitle from "@/app/Components/Layout/Typography/PageTitle";
import { ReactNode } from "react";
import ResourceSearch from "./Components/ResourceSearch";
import CommunityMenu from "./Components/CommunityMenu";
import FloatingAddButton from "./Components/FloatingAddButton";
import ResourceManagementContextProvider from "./Components/ResourceManagementContext";

export default function CommunityResourcesLayout({children}: {children: ReactNode}) {
  return (
    <ResourceManagementContextProvider>
      <div className="w-full h-full mb-4 flex relative">
          <div className="w-full">
            <PageTitle title="Community Resources"/>
            <div className="content relative">
                <div className="absolute top-0 left-0 pl-4 pt-4 w-full flex flex-col md:flex-row gap-2 md:gap-4 mb-4 md:items-center">
                  <CommunityMenu/>
                  <ResourceSearch/>
                </div>
                {children}
            </div>
          </div>
          <FloatingAddButton/>
      </div>    
    </ResourceManagementContextProvider>
  );
}