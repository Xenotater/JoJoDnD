import { doCountResources, doGetResources, doGetResourcesPerPage } from "@/app/Actions/community.action";

export default async function CommunityResourcesPage() {
  const page = 1;
  const perPage = await doGetResourcesPerPage();
  const total = await doCountResources() ?? 0;
  const resources = await doGetResources(page);

  return (
    <div>
      {resources?.map((r) => <div key={r.name}>{r.name}</div>)}
      <span>{page}/{Math.ceil(total/perPage)}</span>
    </div>
  );
}