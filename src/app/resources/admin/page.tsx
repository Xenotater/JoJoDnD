import PageTitle from "@/app/Components/Layout/Typography/PageTitle";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PendingResourceList from "./Components/PendingResourceList";


export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user.role == "admin"))
    return redirect("/account");

  return (
    <div>
      <PageTitle title="Admin Console"/>
      <div className="content">
        <PendingResourceList/>
      </div>
    </div>
  )
}