import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import {attributes} from "@/../public/data/weapons.json";

export default function AttributesList() {
  return (
    <div id="attributes" className="w-full">
      <ContentHeading as={"h3"} className="underline mb-2">Weapon Attributes</ContentHeading>
      <ul className="list-disc flex flex-col gap-1 leading-4">
        {Object.keys(attributes).map((attr) => (
          <li key={attr}><b>{attr}: </b>{attributes[attr as keyof typeof attributes].desc}</li>
        ))}
      </ul>
    </div>
  )
}