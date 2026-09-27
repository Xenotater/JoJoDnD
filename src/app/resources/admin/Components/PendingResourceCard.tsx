"use client";

import { CommunityResource } from "@/app/Models/Resources.model";
import CommunityResourceCard from "../../community/Components/Card/CommunityResourceCard";
import { doApproveResource, doDenyResource } from "@/app/Actions/community.action";
import { useRouter } from "next/navigation";

export default function PendingResourceCard({data, bucketURL}: {data: CommunityResource, bucketURL: string}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 border rounded-md p-1 m-1 w-[500px]">
      <div className="flex gap-2">
        <CommunityResourceCard data={data} bucketURL={bucketURL}/>
        <div className="flex flex-col gap-1">
          <span>User: {data.username}</span>
          <span>Contact: {data.contact}</span>
          <span>Date: {data.insert_ts?.toLocaleDateString()}</span>
          <span>Type: {data.meta}</span>
          <span className="break-all">Links: {data.link}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="rounded-sm text-lg grow bg-red-500" onClick={() => {
          doDenyResource(data.id).then(() => router.refresh());
        }}>Deny</button>
        <button className="rounded-sm text-lg grow bg-green-500" onClick={() => {
          doApproveResource(data.id).then(() => router.refresh());
        }}>Approve</button>
      </div>
    </div>
  )
}