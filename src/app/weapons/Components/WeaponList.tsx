"use client";

import ContentList, { ContentListData } from "@/app/Components/Content/ContentList/ContentList";
import { ContentTags } from "@/app/Models/Misc.model";
import { redirect, useParams } from "next/navigation";
import { JSX, useEffect } from "react";

export default function WeaponList({listContent, tags}: {listContent: ContentListData[], tags: ContentTags[]}) {
  const params = useParams();

  //get weapon search from hash and move to query
  useEffect(() => {
    const hash = window.location.hash.replace("#", "").replace(/\?[^#]*/, "");
    if (hash && hash != "attributes")
      redirect(window.location.href.replaceAll(/(\?|#).*$/g, "") + "?search=" + hash);
  }, [params]);

  const attributeSort = (a: JSX.Element[], b: JSX.Element[]) => {
    // const attrA = a[0].props.children[0].props.label;      // is sorting by the first attribute alphabetically useful??
    // const attrB = b[0].props.children[0].props.label;
    return ((a.length < b.length) ? -1 : ((a.length > b.length) ? 1 : 0));
  }

  const weaponPropSort = (a: string, b: string) => {
    if (a == "None" || a.includes("DC"))
            a = "A";
    if (b == "None" || b.includes("DC"))
        b = "A";
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  }

  const damageSort = (a: string, b: string) => {
    let x, y;
    const dieX = diceParse(a), dieY = diceParse(b);
            x = dieX.max;
            y = dieY.max;
            if (x == y) {
                x = dieX.avg;
                y = dieY.avg;
            }
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  }

  const diceParse = (s: string) => {
      const dice = s.split(/(?<= [A-z]+) \+ /);
      let max = 0, avg = 0;
      for (let i=0; i<dice.length; i++) {
          const val = dice[i].match(/^\d+d\d+/);
          let add = parseInt(dice[i].match(/(?<=^\d+d\d+ ?\+ ?)[0-9]+/)?.toString() ?? "");
          if (!add)
              add = 0;
          if (val != null) {
              const num = parseInt(val[0].substring(0, val[0].indexOf('d')));
              const die = parseInt(val[0].substring(val[0].indexOf('d') + 1));
              avg += num * ((die/2) + 0.5) + add;
              max += num * die + add;
          }
      }
      return {max: max, avg: avg};
  }

  return (
      <ContentList content={listContent} tags={tags} options={{height: "750px", width: "100%", scrollWidth: "1024px", borders: true, columns:[
        {name: "Name", width: "15%", tooltip: "The name of the weapon.", sort: true},
        {name: "Attributes", width: "23%", tooltip: "The properties that the weapon has.", sort: true, sortFn: attributeSort as (a: unknown, b: unknown) => number},
        {name: "Type", width: "10%", tooltip:"The type of weapon for the purpose of Proficiencies.", sort: true},
        {name: "Specialization", width: "15%", tooltip: "The type of weapon for the purpose of Specialization Feats.", sort: true, sortFn: weaponPropSort as (a: unknown, b: unknown) => number},
        {name: "Stat/DC", width: "10%", tooltip: "The attack stat or DC of the weapon. The attack stat is added to both Attack AND damage Rolls. If the weapon has a DC, a Dex Save must be rolled and have damage is taken on success.", sort: true, sortFn: weaponPropSort as (a: unknown, b: unknown) => number},
        {name: "Prerequisite", width: "12%", tooltip: "The requirement that must be met in order to peroperly use the weapon.", sort: true, sortFn: weaponPropSort as (a: unknown, b: unknown) => number},
        {name: "Damage", width: "15%", tooltip: "The damage the weapon deals when it hits.", sort: true, sortFn: damageSort as (a: unknown, b: unknown) => number}], filter: true, search: true}}/>
  )
}