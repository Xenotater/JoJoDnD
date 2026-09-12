import { getTranslations } from "next-intl/server";
import CommunityResourceList from "./Components/CommunityResourceList";
import { getBucketURL } from "@/app/Utilities/aws.utility";

export default async function CommunityResourcesPage() {
  const bucketURL = await getBucketURL();
  const t = await getTranslations("Community");
  
  return (
    <div>
      <p className="text-lg text-center mt-14 mb-4 md:text-left md:max-w-[calc(100%-250px)] md:ml-16 md:mt-2 relative z-1">{t("pageDesc")}</p>
      <CommunityResourceList bucketURL={bucketURL}/>
    </div>
  );
}

export const metadata = {
  title: "Community Resources",
  description: "A variety of resources created by our awesome community!"
}