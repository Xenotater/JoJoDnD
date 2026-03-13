"use client";

import { createContext, useContext, useState } from "react";
import { CommunityResource } from "@/app/Models/Resources.model";
import UpdateResourceForm from "./UpdateResourceForm";
import { useRouter } from "next/navigation";
import { doUpdateResourceStatus } from "@/app/Actions/community.action";

export interface ResourceManager {
  update: (resource?: CommunityResource) => void;
  toggleVisibility: (resource: CommunityResource) => void;
  delete: (resource: CommunityResource) => void;
}

const ResourceManagementContext = createContext<ResourceManager>({update: () => {}, toggleVisibility: () => {}, delete: () => {}});

export const useResourceManager = () => useContext(ResourceManagementContext);

export default function ResourceManagementContextProvider({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [existingResource, setExistingResource] = useState<CommunityResource | undefined>();

  return ( 
    <ResourceManagementContext value={{
      update: (resource?: CommunityResource) => {setExistingResource(resource); setUpdateOpen(true);},
      toggleVisibility: (resource: CommunityResource) => {doUpdateResourceStatus(resource.id, resource.status == "Hidden" ? "Approved" : "Hidden"); router.refresh();},
      delete: (resource: CommunityResource) => {setExistingResource(resource); setDeleteOpen(true);}
    }}>
      {updateOpen &&
        <UpdateResourceForm closer={() => {setExistingResource(undefined); setUpdateOpen(false);}} existingData={existingResource}/>
      }
      {children}
    </ResourceManagementContext>
  );
}