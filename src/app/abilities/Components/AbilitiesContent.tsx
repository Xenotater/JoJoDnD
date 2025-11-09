import HTMLInclusiveText from "@/app/Components/Display/HTMLInclusiveText";
import PreviewLink from "@/app/Components/Display/PreviewLink";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { AbilityData } from "@/app/Models/Abilities.model";

export default function AbilitiesContent({data}: {data: AbilityData | undefined}) {
  if (!data)
    return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>

  const sourceLinkMap = new Map([
    ["Hum", <PreviewLink key="Hum" href="/races/Human">Humans</PreviewLink>],
    ["PM", <PreviewLink key="PM" href="/classes/Pillar Man">Pillar Men</PreviewLink>],
    ["Rock", <PreviewLink key="Rock" href="/races/Rock Human">Rock Humans</PreviewLink>],
    ["Ani", <PreviewLink key="Ani" href="/races/Animal %2F Rock Animal">Animals</PreviewLink>],
    ["RkAni", <PreviewLink key="RkAnim" href="/races/Animal %2F Rock Animal">Rock Animals</PreviewLink>],
    ["Cyb", <PreviewLink key="Cyb" href="/races/Cyborg">Cyborgs</PreviewLink>],
    ["Gho", <PreviewLink key="Gho" href="/races/Ghost">Ghosts</PreviewLink>],
    ["Chi", <PreviewLink key="Chi" href="/races/Living Chimera">Living Chimeras</PreviewLink>],
    ["Stnd", <PreviewLink key="Stnd" href="/races/Living Stand">Living Stands</PreviewLink>],
    ["Pla", <PreviewLink key="Pla" href="/races/Plant">Plants</PreviewLink>],
    ["Zom", <PreviewLink key="Zom" href="/races/Zombie">Zombies</PreviewLink>],
    ["Ghl", <PreviewLink key="Ghl" href="/races/Ghoul">Ghouls</PreviewLink>],
    ["Vamp", <PreviewLink key="Vamp" href="/races/Vampire">Vampires</PreviewLink>],
    ["EPM", <PreviewLink key="EPM" href="/races/Enhanced Pillar Man">Enhanced Pillar Men</PreviewLink>],
    ["Ult", <PreviewLink key="Ult" href="/races/Ultimate Being">Ultimate Beings</PreviewLink>],
    ["Abom", <PreviewLink key="Abom" href="/races/Abomination">Abominations</PreviewLink>],
    ["UnChi", <PreviewLink key="UnChi" href="/races/Undead Chimera">Undead Chimeras</PreviewLink>],
    ["Stands", <PreviewLink key="Stands" href="/classes/Stands">All Stands</PreviewLink>],
    ["Pwr", <PreviewLink key="Pwr" href="/classes/Power-Type">Power-Type Stands</PreviewLink>],
    ["Rng", <PreviewLink key="Rng" href="/classes/Ranged-Type">Ranged-Type Stands</PreviewLink>],
    ["Rmt", <PreviewLink key="Rmt" href="/classes/Remote-Type">Remote-Type Stands</PreviewLink>],
    ["Abl", <PreviewLink key="Abl" href="/classes/Ability-Type">Ability-Type Stands</PreviewLink>],
    ["Enh", <PreviewLink key="Enh" href="/classes/Enhancement-Type">Enhancement-Type Stands</PreviewLink>],
    ["Rev", <PreviewLink key="Rev" href="/classes/Revenge-Type">Revenge-Type Stands</PreviewLink>],
    ["Ind", <PreviewLink key="Ind" href="/classes/Independent-Type">Independent-Type Stands</PreviewLink>],
    ["Hive", <PreviewLink key="Hive" href="/classes/Hive-Type">Hive-Type Stands</PreviewLink>],
    ["Act", <PreviewLink key="Act" href="/classes/Act-Type">Act-Type Stands</PreviewLink>],
    ["Rip", <PreviewLink key="Rip" href="/classes/Ripple">Ripple Users</PreviewLink>],
    ["Spin", <PreviewLink key="Spin" href="/classes/Spin">Spin Users</PreviewLink>],
    ["Art", <PreviewLink key="Art" href="/classes/Artisan">Artisans</PreviewLink>],
    ["Ass", <PreviewLink key="Ass" href="/classes/Assassin">Assassins</PreviewLink>],
    ["Con", <PreviewLink key="Con" href="/classes/Consul">Consuls</PreviewLink>],
    ["Hvy", <PreviewLink key="Hvy" href="/classes/Heavyweight">Heavyweights</PreviewLink>],
    ["Rgr", <PreviewLink key="Rgr" href="/classes/Ranger">Rangers</PreviewLink>],
    ["Sch", <PreviewLink key="Sch" href="/classes/Scholar">Scholars</PreviewLink>],
    ["War", <PreviewLink key="War" href="/classes/Warrior">Warriors</PreviewLink>],
    ["Req", <PreviewLink key="Req" href="/artifacts/Stand Arrow#requiem">Requiem Stands</PreviewLink>],
    ["Hvn", <PreviewLink key="Hvn" href="/artifacts/Heaven">Heaven Stands</PreviewLink>],
    ["Cor", <PreviewLink key="Cor" href="/artifacts/Holy Corpse Parts">Corpse Part Holders</PreviewLink>]
  ]);

  //TODO: Consider getting the "given to" from the classes data to prevent desyncs
  return (
    <div className="w-full h-full flex flex-col justify-between gap-2">
      <div>
        <ContentHeading className="underline">{data.name}</ContentHeading>
        {data.desc.map((d, i) => (<HTMLInclusiveText as="div" text={d} key={`${data.name}-desc-${i}`}/>))}
      </div>
      <div>
        <ContentHeading as="h3">Given To</ContentHeading>
        <ul className='list-disc columns-[200px 2]'>
          {data.classes.map((c, i) => (<li key={`${data.name}-given-${i}`}>{sourceLinkMap.get(c)}</li>))}
        </ul>
      </div>
    </div>
  )
}