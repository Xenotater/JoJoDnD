import { NestedNote } from "@/app/Models/Resources.model";

export default function NestedPatchNote({note, depth}: {note: NestedNote, depth?: number}) {
  return (
    <li>
      {note.content}
      {note.notes && note.notes.length > 0 && (
        <ul className={`list-inside ${(depth || 1)%3 == 0 ? "list-disc" : (depth || 1)%2 == 0 ? "" : "list-square"}`}>
          {note.notes.map((n, index) => (
            typeof n === "string" ? <li key={index}>{n}</li> : <NestedPatchNote key={index} note={n} depth={(depth || 1) + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}