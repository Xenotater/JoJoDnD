import CommunityResourceList from "./Components/CommunityResourceList";
import { getBucketURL } from "@/app/Utilities/aws.utility";

export default async function CommunityResourcesPage() {
  const bucketURL = await getBucketURL();
  return (
    <div>
      <p className="text-lg text-center mt-14 mb-4 md:text-left md:max-w-[calc(100%-250px)] md:ml-16 md:mt-2">These awesome resources were created by members of the JoJo D&D community!</p>
      <CommunityResourceList bucketURL={bucketURL}/>
    </div>
  );
}

export const metadata = {
  title: "Community Resources",
  description: "A variety of resources created by our awesome community!"
}