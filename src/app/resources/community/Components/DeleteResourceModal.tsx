"use client";

import { doDeleteResource } from "@/app/Actions/community.action";
import Modal from "@/app/Components/Layout/Modal/Modal";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { CommunityResource } from "@/app/Models/Resources.model";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DeleteResourceModal({data, closer}: {data: CommunityResource, closer: () => void}) {
  const [name, setName] = useState("");
  const [alert, setAlert] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const handleDelete = async () => {
    setAlert("");
    if (name == data.name) {
      const resp = await doDeleteResource(data.id);
      if (resp == 200){
        router.replace(`${pathname}?${params.toString()}&success=true`);
        closer();
      }
      else
        setAlert("Something went wrong. Please contact an administrator.");
    }
    else
      setAlert("The name you entered does not match the resource.");
  }

  return (
    <Modal fullPage closeCallback={closer}>
      <form className="content max-w-[50vw] flex flex-col gap-2 text-center items-center" onSubmit={(e) => e.preventDefault()}>
        <ContentHeading as="h2" className="m-0">Delete Resource</ContentHeading>
        <p>Are your sure you want to delete <b>{data.name}</b>?</p>
        <p>Deleted Resources CANNOT be recovered. If you&apos;re certain, type the name of the resource below and click &quot;Delete&quot;.</p>
        <input className="max-w-[80%] text-xl" onChange={(e) => {setAlert(""); setName(e.target.value);}}/>
        <div className="w-full flex justify-around mt-2">
          <button className="rounded-md text-2xl bg-gray-200" onClick={closer}>Cancel</button>
          <button className="text-2xl rounded-md bg-jj-purple-1 text-white" onClick={handleDelete}>Submit</button>
        </div>
        {alert &&
          <p className="text-red-800 flex gap-1 justify-center animate-flash">{alert}</p>
        }
      </form>
    </Modal>
  );
}