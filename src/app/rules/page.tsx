import { redirect } from "next/navigation";

//rules stub page, no content, redirect to subcategory page
export default function RulesStub() {
  redirect("/rules/basics");
}