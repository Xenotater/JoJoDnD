import Divider from "@/app/Components/Layout/Divider/Divider";
import PageTitle from "@/app/Components/Layout/Typography/PageTitle";
import { getPatches } from "@/app/Utilities/content.utility";
import { useTranslations } from "next-intl";
import PatchNoteItem from "./Components/PatchNote";

export default function PatchNotesPage() {
  const t = useTranslations("Resources");
  const patchNotes = getPatches();

  return (
    <div className="w-full h-full">
      <PageTitle title={t("patch")}/>
      <div className="content">
        <p>{t.rich("patchDesc2", { github: (chunks) => <a href="https://github.com/Xenotater/JoJoDnD" target="_blank">{chunks}</a>})}</p>
        <Divider/>
        {patchNotes.map((note, index) => (
          <div key={index}>
            <PatchNoteItem note={note} />
            {index < patchNotes.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </div>
  )
}