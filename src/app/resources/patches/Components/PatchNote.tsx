import { PatchNote } from "@/app/Models/Resources.model";
import NestedPatchNote from "./NestedNote";

export default function PatchNoteItem({note}: {note: PatchNote}) {
  const websiteOnly = note.version?.split(".").length === 4;

  return (
    <div className="flex flex-col gap-2">
      <p className={websiteOnly ? "text-lg" : "text-2xl"}>
        {note.date.toLocaleDateString()}
        {note.version && (websiteOnly ? ` - Website Update v${note.version}` : <b> - Version {note.version}</b>)}
        {note.title && ` - ${note.title}`}
      </p>
      <ul className="list-disc list-inside">
        {note.notes.map((n, index) => (
          typeof n === "string" ? <li key={index}>{n}</li> : <NestedPatchNote key={index} note={n} />
        ))}
      </ul>
    </div>
  )
}