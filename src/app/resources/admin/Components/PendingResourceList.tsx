import { doGetPendingResources } from "@/app/Actions/community.action";
import { getBucketURL } from "@/app/Utilities/aws.utility";
import PendingResourceCard from "./PendingResourceCard";


export default async function PendingResourceList() {
  const bucketURL = await getBucketURL();
  const resources = await doGetPendingResources();

  return (
    <div className="max-h-[800px] overflow-y-scroll">
      <h2>Pending Community Resources</h2>
      <div className="flex flex-wrap">
        {resources && resources.map(resource => (
          <PendingResourceCard key={resource.id} data={resource} bucketURL={bucketURL}/>
        ))}
      </div>
    </div>
  )
}