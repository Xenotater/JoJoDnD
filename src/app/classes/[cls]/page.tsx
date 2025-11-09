import { ClassData } from "@/app/Models/Classes.model";
import { getClassData } from "@/app/Utilities/content.utility";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { toTitleCase } from "@/app/Utilities/misc.utility";
import ClassesContent from "../Components/ClassesContent";

export default async function Class(props: {params: Promise<{cls: string}>}) {
  const selectedClass = decodeURIComponent((await props.params).cls);
  const classData: ClassData | undefined = getClassData(selectedClass);

  if (!classData)
    redirect("/classes/Stands");

  return (
    <div className="content grow min-h-[40vh]">
      <ClassesContent data={classData}/>
    </div>
  );
}

export async function generateMetadata(props: {params: Promise<{cls: string}>}): Promise<Metadata> {
  const clsName = decodeURIComponent((await props.params).cls);
  return { title: toTitleCase(clsName) }
}