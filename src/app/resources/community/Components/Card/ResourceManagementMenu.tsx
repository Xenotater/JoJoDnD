"use client";

import Divider from "@/app/Components/Layout/Divider/Divider";
import Modal from "@/app/Components/Layout/Modal/Modal";
import { CommunityResource } from "@/app/Models/Resources.model";
import { useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { useResourceManager } from "../ResourceManagementContext";

export default function ResourceManagementMenu({data}: {data: CommunityResource}) {
  const manager = useResourceManager();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="absolute top-[-8px] right-[-8px] flex items-center">
        <div className="p-1.5 bg-purple-700 border rounded-[50%] cursor-pointer hover:shadow-sm/33 z-2">
          <BsGearFill size={20} color="white" onClick={() => setOpen(!open)}/>
        </div>
      </div>
      {open &&
        <Modal closeCallback={() => setOpen(false)}>
          <div className="absolute right-1 top-1 border-2 rounded-md bg-jj-mpurple-1 pt-1 pb-1 z-1">
            <a onClick={() => manager.update(data)} className="cursor-pointer underline ml-2 mr-2 pr-4 hover:text-gray-800">Edit</a>
            {data.status == "Approved" &&
              <>
                <Divider className="mt-1 mb-1"/>
                <a onClick={() => manager.toggleVisibility(data)} className="cursor-pointer underline ml-2 mr-2 hover:text-gray-800">Hide</a>
              </>
            }
            {data.status == "Hidden" &&
              <>
                <Divider className="mt-1 mb-1"/>
                <a onClick={() => manager.toggleVisibility(data)} className="cursor-pointer underline ml-2 mr-2 hover:text-gray-800">Show</a>
              </>
            }
            {(data.status != "Approved") &&
              <>
                <Divider className="mt-1 mb-1"/>
                <a onClick={() => manager.delete(data)} className="cursor-pointer underline ml-2 mr-2 hover:text-gray-800">Delete</a>
              </>
            }
          </div>
        </Modal>
      }
    </>
  );
}