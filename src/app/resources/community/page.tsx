import { getBucketURL } from "@/app/Utilities/aws.utility";
import Temp from "./temp";

export default async function CommunityResourcesPage() {

  return (
    <div>
      <input type="file" accept="image/*"/>
      <Temp bucket={await getBucketURL()}/>
    </div>
  );
}