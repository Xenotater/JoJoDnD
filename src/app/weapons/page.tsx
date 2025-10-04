import { ContentListData } from "../Components/Content/ContentList/ContentList";
import HTMLInclusiveText from "../Components/Display/HTMLInclusiveText";
import ContentHeading from "../Components/Layout/Typography/ContentHeading";
import PageTitle from "../Components/Layout/Typography/PageTitle";
import {weapons, attributes, tags} from "../../../public/data/weapons.json";
import Tooltip from "../Components/Layout/Typography/Tooltip";
import { WeaponAttribute } from "../Models/Weapons.model";
import WeaponList from "./Components/WeaponList";

export default function WeaponsPage() {
  const listContent: ContentListData[] = [];
  for (const weapon of weapons) {
    listContent.push({
      name: weapon.name,
      other: [
        <span key={"attr"} className="flex flex-wrap">{weapon.attr.map((attr, i) => {
          const attrData = attributes[attr.replace(/ \(.*\)/, "") as keyof typeof attributes] as WeaponAttribute;
          const replacers = attr.replaceAll(/(^.* \(|\)$)/g, "").split("/");
          const tooltip = <Tooltip label={attr}>{attrData.tooltip ? attrData.tooltip.replace("{X}", replacers[0] ?? "").replace("{Y}", replacers[1] ?? "") : attrData.desc}</Tooltip>;
        return <span key={`${weapon.name}-attr-${i}`}>{tooltip}{i + 1 < weapon.attr.length && <span>,&nbsp;</span>}</span>;
        })}</span>,
        <span key={"type"}>{weapon.type}</span>,
        <span key={"spec"}>{weapon.spec}</span>,
        <span key={"stat"}>{weapon.stat}</span>,
        <span key={"prereq"}>{weapon.prereq}</span>,
        <span key={"dmg"}>{weapon.dmg}</span>
      ],
      tags: weapon.tags,
      isLink: false
    });
  }

  return (
    <div className="w-full h-full">
      <PageTitle title="Weapons"/>
      <div className="flex gap-2 items-center m-4">
        <div className="content text-center flex flex-col gap-2">
          <ContentHeading as={"h5"} className="underline">Prerequisites</ContentHeading>
          <p>You may still use a weapon you aren&apos;t Proficient in the use of, but you may not add your Proficiency Bonus to your Attack Rolls.</p>
          <p>If you do not meet a Prerequisite for use of a weapon you may still use it, but all attacks using it will have Disadvantage.</p>
        </div>
        <div className="content text-center flex flex-col gap-2">
          <ContentHeading as={"h5"} className="underline">Weapons and Stands</ContentHeading>
          <HTMLInclusiveText as={"p"} text="Normal weapons cannot damage Stands. However, if you take the <preview href='/feats/Energy Imbuement'>Energy Imbuement</preview> Feat, 
            when a weapon is imbued (or incorporated into the Stand itself) it deals Stand damage instead and may now damage Stands"/>
          <p>If your Stand wields a weapon or has a weapon incorporated into it, it may attack using its own stats rather than that of the User. For example, Strength becomes Power, Dexterity becomes Precision, and Constitution becomes Durability.</p>
        </div>
      </div>
      <WeaponList listContent={listContent} tags={tags}/>
    </div>
  );
}

export const metadata = {
  title: "Weapons",
  description: "Unique weapons for JoJo's Bizarre Tabletop Game"
}