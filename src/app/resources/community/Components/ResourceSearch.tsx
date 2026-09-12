"use client";

import { ResourceSort } from "@/app/Models/Resources.model";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResourceSearch() {
  const path = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Community");
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [sort, setSort] = useState<ResourceSort>("Top");

  useEffect(() => {
    const newParams = new URLSearchParams(params);
    newParams.set("search", search);
    newParams.set("sort", sort);
    router.replace(path + `?${newParams}`);
  }, [search, sort])

  return (
    <div className="absolute top-0 right-0 flex flex-col items-end md:items-center gap-1">
      <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded-bl-md rounded-tr-sm bg-white"/>
      <div className="flex mr-1 items-center gap-2">
        {t("sort")} <select value={sort} onChange={(e) => setSort(e.target.value as ResourceSort)} className="border bg-white">
          <option value="Top">{t("top")}</option>
          <option value="New">{t("new")}</option>
          <option value="A-Z">{t("alpha")}</option>
        </select>
      </div>
    </div>
  );
}