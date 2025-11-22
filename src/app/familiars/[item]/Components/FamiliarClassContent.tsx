import { FancyImage } from "@/app/Components/Layout/FancyImage/FancyImage";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import LevelTable from "@/app/Components/LevelTable/LevelTable";
import { FamiliarClass } from "@/app/Models/Familiars.model";

export default function FamiliarClassContent({data}: {data: FamiliarClass}) {
  return (
    <div className="w-full h-full flex flex-col gap-4 mb-4">
      <ContentHeading className="underline mb-0">{data.name}</ContentHeading>
      <FancyImage type="border" className="max-w-[80%] max-h-[40vh] w-auto m-auto" src={`/images/familiars/${data.img}.webp`} alt={data.name}/>
      <div>
        <ContentHeading as="h3">Description</ContentHeading>
        <p>{data.desc}</p>
      </div>
      <p><b>Primary Stat:</b> {data.prime}</p>
      <p><b>Proficiencies:</b> Choose {data.profNum} of the following: {data.profs}. Additionally, choose {data.adProfs} other Proficiencies.</p>
      <p><b>Saving Throws:</b> {data.name} Familiars are Proficient in {data.prime} Saving Throws, and one other Saving Throw of your choice.</p>
      <p><b>Effect DC:</b> 8 + Proficiency Bonus + {data.prime} Modifier</p>
      <div>
        <ContentHeading as="h3">Leveling Up</ContentHeading>
        <LevelTable showProf={true} headBg={"rgb(139, 139, 139)"} beforeLabels={["Feats"]} afterLabels={["Ability Dice"]} levels={
          data.levels.map((l) => ({
            beforeEx: [`${l.feats}`],
            features: {
              other: l.features?.map((f) => f == "OR" ? f : `<preview href='/familiars/${f}'>${f}</preview>`)
            },
            afterEx: [`${l.dice}dx`]
          }))
        }/>
      </div>
    </div>
  );
}