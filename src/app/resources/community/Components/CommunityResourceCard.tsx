"use client";

import { CommunityResource } from "@/app/Models/Resources.model";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { Textfit } from "react-textfit";

export default function CommunityResourceCard({data, bucketURL}: {data: CommunityResource, bucketURL: string}) {
  const [userUpvoted, setUserUpvoted] = useState(false);

  const upvoteResource = () => {
    setUserUpvoted(!userUpvoted);
    //server action
  }

  return (
    <div className="border-2 rounded-md basis-full md:basis-1/4 h-[360px] bg-purple-700 flex flex-col relative text-black hover:shadow-lg/50">
      <Link href={data.link} target="_blank" className="h-full">
        <Textfit className="h-[10%] w-full flex items-center justify-center p-0.5">{data.name}</Textfit>
        <div className="h-[50%] w-full relative border-t border-b">
          <Image src={`${bucketURL}CommunityResources/Images/${data.name.toLowerCase().replaceAll(" ", "-").replaceAll(/[^a-z0-9-_]/g, "")}.webp?v=${data.modified}`} alt={data.name} fill/>
        </div>
        <p className="text-center p-2">{data.description}</p>
      </Link>
      <div className="absolute bottom-0 right-0 border-t border-l rounded-tl-md p-1 flex gap-1 cursor-pointer" onClick={upvoteResource}>
        {userUpvoted ? <BsHandThumbsUpFill fill="gold" stroke="black" strokeWidth={1.5}/> : <BsHandThumbsUp/>}
        {data.upvotes}
      </div>
    </div>
  );
}