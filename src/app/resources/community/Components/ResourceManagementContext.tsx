"use client";

import { createContext, useContext, useState } from "react";
import { CommunityResource } from "@/app/Models/Resources.model";
import UpdateResourceForm from "./UpdateResourceForm";
import { useRouter } from "next/navigation";
import { doToggleResourceVisibility } from "@/app/Actions/community.action";
import DeleteResourceModal from "./DeleteResourceModal";

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
      toggleVisibility: (resource: CommunityResource) => {doToggleResourceVisibility(resource.id); router.refresh();},
      delete: (resource: CommunityResource) => {setExistingResource(resource); setDeleteOpen(true);}
    }}>
      {updateOpen &&
        <UpdateResourceForm closer={() => {setExistingResource(undefined); setUpdateOpen(false);}} existingData={existingResource}/>
      }
      {deleteOpen && existingResource &&
        <DeleteResourceModal closer={() => {setExistingResource(undefined); setDeleteOpen(false);}} data={existingResource}/>
      }
      {children}
    </ResourceManagementContext>
  );
}