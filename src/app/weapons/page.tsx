import ContentHeading from "../Components/Layout/Typography/ContentHeading";
import PageTitle from "../Components/Layout/Typography/PageTitle";
import {weapons, attributes, tags} from "@/../public/data/weapons.json";
import WeaponList from "./Components/WeaponList";
import PreviewLink from "../Components/Display/PreviewLink";
import AttributesList from "./Components/AttributesList";
import { ContentListData } from "../Components/Content/ContentList/ContentList";
import Tooltip from "../Components/Layout/Typography/Tooltip";
import HTMLInclusiveText from "../Components/Display/HTMLInclusiveText";
import { WeaponAttribute } from "../Models/Weapons.model";

export default function WeaponsPage() {
  const content: ContentListData[] = weapons.map((weapon) => ({
    name: weapon.name,
      other: [
        <span key={`${weapon.name}-attr`} className="flex flex-wrap">{weapon.attr.map((attr, i) => {
          const attrData = attributes[attr.replace(/ \(.*\)/, "") as keyof typeof attributes] as WeaponAttribute;
          const replacers = attr.replaceAll(/(^.* \(|\)$)/g, "").split("/");
          const tooltip = <Tooltip key={`${weapon.name}-attr-${i}-tooltip`} label={attr}>{attrData.tooltip ? attrData.tooltip.replace("{X}", replacers[0] ?? "").replace("{Y}", replacers[1] ?? "") : attrData.desc}</Tooltip>;
        return <span key={`${weapon.name}-attr-${i}`}>{tooltip}{i + 1 < weapon.attr.length && <span key={`${weapon.name}-attr-${i}-separator`}>,&nbsp;</span>}</span>;
        })}</span>,
        weapon.type,
        <HTMLInclusiveText key={`${weapon.name}-spec`} text={weapon.spec.replaceAll("/", "/<wbr>")}/>,
        weapon.stat,
        weapon.prereq,
        <HTMLInclusiveText key={`${weapon.name}-dmg`} text={weapon.dmg.replaceAll("/", "/<wbr>")}/>
      ],
      tags: weapon.tags,
      isLink: false
  }))

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageTitle title="Weapons"/>
      <div className="flex flex-col md:flex-row gap-4 items-center md:ml-4 md:mr-4">
        <div className="content text-center flex flex-col gap-2">
          <ContentHeading as={"h5"} className="underline">Prerequisites</ContentHeading>
          <p>You may still use a weapon you aren&apos;t Proficient in the use of, but you may not add your Proficiency Bonus to your Attack Rolls.</p>
          <p>If you do not meet a Prerequisite for use of a weapon you may still use it, but all attacks using it will have Disadvantage.</p>
        </div>
        <div className="content text-center flex flex-col gap-2">
          <ContentHeading as={"h5"} className="underline">Weapons and Stands</ContentHeading>
          <p>
            Normal weapons cannot damage Stands. However, if you take the <PreviewLink href='/feats/Energy Imbuement'>Energy Imbuement</PreviewLink> Feat, 
            when a weapon is imbued (or incorporated into the Stand itself) it deals Stand damage instead and may now damage Stands
          </p>
          <p>If your Stand wields a weapon or has a weapon incorporated into it, it may attack using its own stats rather than that of the User. For example, Strength becomes Power, Dexterity becomes Precision, and Constitution becomes Durability.</p>
        </div>
      </div>
      <WeaponList listContent={content} tags={tags}/>
      <div className="content">
        <AttributesList />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Weapons",
  description: "Unique weapons for JoJo's Bizarre Tabletop Game"
}