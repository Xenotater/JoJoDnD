import Divider from "@/app/Components/Layout/Divider/Divider";
import PageTitle from "@/app/Components/Layout/Typography/PageTitle";
import { getAllFiles } from "@/app/Utilities/files.utility";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function FileViewer({searchParams}: {searchParams: Promise<{path: string, sort: string}>}) {
  const params = await searchParams;
  const path = params.path;
  const files = await getAllFiles("@/../public" + path);
  files.sort((a, b) => {
    const vTimeA = parseInt(a.name.replace(/^.*v((\d|\.)+)[^v]*$/, "$1").replace(".", ""));
    const vTimeB = parseInt(b.name.replace(/^.*v((\d|\.)+)[^v]*$/, "$1").replace(".", ""));
    return params.sort == "version" ? vTimeA - vTimeB : b.time.getTime() - a.time.getTime() ;
  })
  const t = await getTranslations("Resources");

  return (
    <div>
      <PageTitle title={t("contents", {dir: path})}/>
      <div className="content">
        {files.map((f, i) => (
          <div key={f.name} className="w-full flex flex-col">
            <div className="w-full flex justify-between">
              <Link href={`${path}/${f.name}`}>{f.name}</Link>
              <span>{f.time.toLocaleDateString()}</span>
            </div>
            {i < files.length &&
              <Divider/>
            }
          </div>
        ))}
      </div>
    </div>
  )
}