"use client";

import { CommunityResource } from "@/app/Models/Resources.model";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { Textfit } from "react-textfit";
import ResourceVariantSublist from "./ResourceVariantSublist";
import ResourceStatus from "./ResourceStatus";
import ResourceManagementMenu from "./ResourceManagementMenu";
import { useAuth } from "@/app/Components/Auth/AuthContextProvider";
import { useSession } from "next-auth/react";
import { approveNewResource, approveUpdatedResource, doDownvoteResource, doUpvoteResource } from "@/app/Actions/community.action";

export default function CommunityResourceCard({data, userUpvotes, bucketURL, image, preview}: {data: CommunityResource, userUpvotes?: number[], bucketURL?: string, image?: ReactNode, preview?: boolean}) {
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [imgSrcName, setImgSrcName] = useState(data.name.toLowerCase().replaceAll(" ", "-").replaceAll(/[^a-z0-9-_]/g, ""));
  const auth = useAuth();
  const {data: session} = useSession();
  const belongsToUser = data.username == session?.user?.name;
  
  
  useEffect(() => {
    setUserUpvoted(userUpvotes?.includes(data.id) ?? false);
    if (data.clones && !/-edit$/.test(imgSrcName))
      setImgSrcName(imgSrcName + "-edit");
  }, [data, userUpvotes])

  const upvoteResource = () => auth.authExecute(async () => {
    if (!belongsToUser) {
      if (userUpvoted) {
        await doDownvoteResource(data.id);
        data.upvotes!--;
      }
      else {
        await doUpvoteResource(data.id);
        data.upvotes!++;
      }
        //TODO: for debugging - remove
        await approveUpdatedResource(92);
      setUserUpvoted(!userUpvoted);
    }
  });

  const assembleSubItems = () => {
    const links = data.link.split("|");
    const names = data.variants!.split("|");
    const items: {name: string, link: string}[] = [];
    for (let i = 0; i < names.length; i++)
      items.push({name: names[i], link: links[i].replace("{bucketURL}", bucketURL ?? "")});
    return items;
  }

  return (
    <div className="max-w-[275px] min-w-[230px] h-[360px] flex relative">
      <a href={data.variants ? undefined : data.link.replace("{bucketURL}", bucketURL ?? "")} target="_blank" onClick={data.variants ? () => setSubMenuOpen(true) : undefined}
          onKeyDown={(e) => {if (e.key == "Enter") setSubMenuOpen(!subMenuOpen)}} tabIndex={0}
          className={`h-full w-full border-2 rounded-md bg-jj-vibrant-purple hover:shadow-lg/50 cursor-pointer ${subMenuOpen ? "shadow-lg/50" : ""}`}>
        <Textfit className="h-[12%] w-full flex text-center items-center justify-center p-0.5">{data.name}</Textfit>
        <div className="h-[50%] w-full relative border-t border-b bg-white">
          {image ?? 
            <Image src={`${bucketURL}/CommunityResources/Images/${imgSrcName}.webp?v=${data.modified_ts}`} alt={data.name} fill/>
          }
        </div>
        <p className="text-center p-2">{data.description}</p>
      </a>
      <div className="absolute bottom-0 right-0 border-t border-l rounded-tl-md h-7 p-1 flex gap-1 cursor-pointer hover:shadow-sm/33 items-center hover:items-start" onClick={upvoteResource}>
        {userUpvoted || belongsToUser ? <BsHandThumbsUpFill fill="goldenrod" stroke="black" strokeWidth={1.5} className="self-center"/> : <BsHandThumbsUp/>}
        <span className="self-center">{data.upvotes}</span>
      </div>
      {belongsToUser && !preview &&
        <>
          <ResourceManagementMenu data={data}/>
          <ResourceStatus status={data.status ?? "Unknown"}/>
        </>
      }
      {data.link && data.variants && subMenuOpen &&
        <ResourceVariantSublist parentName={data.name} items={assembleSubItems()} closer={() => setSubMenuOpen(false)}/>
      }
    </div>
  );
}