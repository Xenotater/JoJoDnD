import CommunityResourceList from "./Components/CommunityResourceList";
import { getBucketURL } from "@/app/Utilities/aws.utility";

export default async function CommunityResourcesPage() {
  const bucketURL = await getBucketURL();
  return <CommunityResourceList bucketURL={bucketURL}/>;
}

export const metadata = {
  title: "Community Resources",
  description: "A variety of resources created by our awesome community!"
}