import { redirect } from "next/navigation";

//races stub page, no content, redirect to subcategory page
export default function ClassesStub() {
  redirect("/classes/Stands");
}

export const metadata = {
  title: "Classes",
  description: "Unique classes for JoJo's Bizarre Tabletop Game"
}