import PageTitle from "@/app/Components/Layout/Typography/PageTitle";
import EditorClient from "./Components/EditorClient";
import CharacterManagementContextProvider from "./Components/CharacterManagementContext";

export default function CharacterEditorPage() {
  return (
    <div className="w-full h-full mb-4 flex relative">
      <div className="w-full">
        <PageTitle title="Character Sheet Editor"/>
        <div className="content relative h-full">
          <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4 mb-4 md:items-center">
            <CharacterManagementContextProvider>
              <EditorClient/>
            </CharacterManagementContextProvider>
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