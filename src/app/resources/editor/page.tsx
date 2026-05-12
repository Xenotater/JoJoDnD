import PageTitle from "@/app/Components/Layout/Typography/PageTitle";
import EditorClient from "./Components/EditorClient";
import CharacterManagementContextProvider from "./Components/CharacterManagement/CharacterManagementContext";
import { getBucketURL } from "@/app/Utilities/aws.utility";
import { getTranslations } from "next-intl/server";
import ToastControllerProvider from "@/app/Components/Layout/Toasts/ToastControllerProvider";

export default async function CharacterEditorPage() {
  const t = await getTranslations("Editor");
  const bucketURL = await getBucketURL();

  return (
    <div className="w-full h-full mb-4 flex relative">
      <div className="w-full">
        <PageTitle title={t("title")}/>
        <div className="content relative h-full">
          <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4 mb-4 md:items-center">
            <ToastControllerProvider>
              <CharacterManagementContextProvider bucketUrl={bucketURL}>
                <EditorClient/>
              </CharacterManagementContextProvider>
            </ToastControllerProvider>
          </div>
        </div>
      </div>
    </div>    
  );
}

export const metadata = {
  title: "Character Editor",
  description: "An interactive character sheet editor for JoJo D&D."
}