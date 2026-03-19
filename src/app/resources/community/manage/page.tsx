import { getBucketURL } from "@/app/Utilities/aws.utility";
import CommunityResourceList from "../Components/CommunityResourceList";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";

export default async function ManageResourcesPage() {
  const bucketURL = await getBucketURL();
  const session = await getServerSession();

  if (!session?.user?.name)
    redirect("/resources/community");

  return (
    <div>
      <div className="text-lg text-center mt-14 mb-4 md:text-left md:max-w-[calc(100%-250px)] md:ml-16 md:mt-1 md:flex gap-4 items-center">
        <a href="/resources/community" className="button rounded-md bg-jj-purple-1 text-white flex items-center gap-2 z-2 w-fit"><BsArrowLeft/>Public List</a>
        <p className="mt-4 md:m-0">Manage your resources:</p>
      </div>
      <CommunityResourceList bucketURL={bucketURL} user={session.user.name}/>
    </div>
  );
}