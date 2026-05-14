"use client";

import { doCountResourcePages, doGetResources, doGetUserUpvotes } from "@/app/Actions/community.action";
import { CommunityResource, ResourceSort } from "@/app/Models/Resources.model";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CommunityResourceCard from "./Card/CommunityResourceCard";
import IconButton from "@/app/Components/Layout/IconButton/IconButton";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

export default function CommunityResourceList({bucketURL, user}: {bucketURL: string, user?: string}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [resources, setResources] = useState<CommunityResource[]>([]);
  const [currentPage, setCurrentPage] = useState(parseInt(params.get("page") ?? "1"));
  const [pages, setPages] = useState(1);
  const [userUpvotes, setUserUpvotes] = useState<number[]>([]);

  const getResources = async (page: number, sort: ResourceSort, search: string) => {
    setResources(await doGetResources(page, sort, search, user ?? "") ?? []);
  }

  const changePage = (page: number) => {
    if (page <= pages && page >= 1) {
      const newParams = new URLSearchParams(params.toString());
      newParams.set("page", `${page}`);
      router.replace(pathname + `?${newParams}`);
    }
  }

  const updateStates = async () => {
    const page = parseInt(params.get("page") ?? "1");
    const sort = params.get("sort") as ResourceSort ?? "Top";
    const search = params.get("search") ?? "";
    const count = await doCountResourcePages(search, user) ?? 1;
    let overwritePage = page;;
    if (page > count)
      overwritePage = count;
    else if (page < 1)
      overwritePage = 1;
    getResources(overwritePage, sort, search);
    setCurrentPage(overwritePage);
    setPages(count);
    if (overwritePage != page)
      changePage(overwritePage);
    setUserUpvotes(await doGetUserUpvotes() ?? []);
}

  useEffect(() => {
    if (params.has("success"))
      router.replace(`${pathname}?${params.toString().replace(/&success=true/, "")}`);
    updateStates();
  }, [params]);

  return (
    <div className="w-full h-full min-h-[40vh] flex flex-col justify-between">
      <div className="flex flex-wrap gap-4 2xl:gap-12 justify-evenly">
          {resources.map((r) => (<div key={r.id} className="basis-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex justify-center">
        <CommunityResourceCard data={r} bucketURL={bucketURL} userUpvotes={userUpvotes}/>
      </div>))}
      </div>
      <div className="flex mt-4 items-center">
        {currentPage != 1 ?
          <IconButton onClick={() => changePage(currentPage - 1)} className="bg-jj-purple-1 text-white"><BsArrowLeft size={20}/></IconButton>
          : <div className="w-[36px]"></div>
        }
        <span className="grow text-center text-xl">
          <input type="number" max={pages} min={1} value={currentPage} onChange={(e) => changePage(parseInt(e.target.value) ?? 1)} dir="rtl" className="w-min"/>/{pages}
          </span>
        {currentPage < pages ?
          <IconButton onClick={() => changePage(currentPage + 1)} className="bg-jj-purple-1 text-white"><BsArrowRight size={20}/></IconButton>
          : <div className="w-[36px]"></div>
        }
      </div>
    </div>
  );
}