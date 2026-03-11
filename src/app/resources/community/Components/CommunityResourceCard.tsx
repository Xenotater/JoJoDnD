"use client";

import { CommunityResource } from "@/app/Models/Resources.model";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { Textfit } from "react-textfit";
import ResourceVariantSublist from "./ResourceVariantSublist";
import { authExecute, useAuth } from "@/app/Components/Auth/AuthContext";

export default function CommunityResourceCard({data, bucketURL, image}: {data: CommunityResource, bucketURL?: string, image?: ReactNode}) {
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const auth = useAuth();

  const upvoteResource = () => authExecute(auth, () => {
    setUserUpvoted(!userUpvoted);
    //server action (if bucketURL?)
  });

  const assembleSubItems = () => {
    const links = data.link.split("|");
    const names = data.variants.split("|");
    const items: {name: string, link: string}[] = [];
    for (let i = 0; i < names.length; i++)
      items.push({name: names[i], link: links[i].replace("{bucketURL}", bucketURL ?? "")});
    return items;
  }

  return (
    <div className="max-w-[275px] min-w-[230px] h-[360px] flex relative">
      <a href={data.variants ? undefined : data.link.replace("{bucketURL}", bucketURL ?? "")} target="_blank" onClick={data.variants ? () => setSubMenuOpen(true) : undefined}
          onKeyDown={(e) => {if (e.key == "Enter") setSubMenuOpen(!subMenuOpen)}} tabIndex={0}
          className={`h-full w-full border-2 rounded-md bg-purple-700 hover:shadow-lg/50 cursor-pointer ${subMenuOpen ? "shadow-lg/50" : ""}`}>
        <Textfit className="h-[12%] w-full flex text-center items-center justify-center p-0.5">{data.name}</Textfit>
        <div className="h-[50%] w-full relative border-t border-b bg-white">
          {image ?? 
            <Image src={`${bucketURL}/CommunityResources/Images/${data.name.toLowerCase().replaceAll(" ", "-").replaceAll(/[^a-z0-9-_]/g, "")}.webp?v=${data.modified}`} alt={data.name} fill/>
          }
        </div>
        <p className="text-center p-2">{data.description}</p>
      </a>
      <div className="absolute bottom-0 right-0 border-t border-l rounded-tl-md h-7 p-1 flex gap-1 cursor-pointer hover:shadow-sm/33 items-center hover:items-start" onClick={upvoteResource}>
        {userUpvoted ? <BsHandThumbsUpFill fill="goldenrod" stroke="black" strokeWidth={1.5} className="self-center"/> : <BsHandThumbsUp/>}
        <span className="self-center">{data.upvotes}</span>
      </div>
      {data.variants && subMenuOpen &&
        <ResourceVariantSublist parentName={data.name} items={assembleSubItems()} closer={() => setSubMenuOpen(false)}/>
      }
    </div>
  );
}