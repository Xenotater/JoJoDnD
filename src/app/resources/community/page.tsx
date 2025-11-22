import { doCountResourcePages } from "@/app/Actions/community.action";
import CommunityResourceList from "./Components/CommunityResourceList";
import { getBucketURL } from "@/app/Utilities/aws.utility";

export default async function CommunityResourcesPage() {
  const pages = await doCountResourcePages() ?? 1;
  const bucketURL = await getBucketURL();
  return <CommunityResourceList pages={pages} bucketURL={bucketURL}/>;
}

export const metadata = {
  title: "Community Resources",
  description: "A variety of resources created by our awesome community!"
}