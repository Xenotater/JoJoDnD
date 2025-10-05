import { WeaponData } from "@/app/Models/Weapons.model";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";

export default function WeaponContentItem({data}: {data: WeaponData | undefined}) {
  if (!data)
    return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>

  return (
    <div className="flex flex-col">
      <ContentHeading as="h3">{data.name}</ContentHeading>
      <p><b>Attributes: </b>{data.attr.map((attr, i) => (<span key={`${data.name}-attr-${i}`}>{attr}{i + 1 < data.attr.length && <span>,&nbsp;</span>}</span>))}</p>
      <p><b>Type: </b>{data.type}</p>
      <p><b>Specialization: </b>{data.spec}</p>
      <p><b>Stat/DC: </b>{data.stat}</p>
      <p><b>Prerequisite: </b>{data.prereq}</p>
      <p><b>Damage: </b>{data.dmg}</p>
    </div>
  )
}