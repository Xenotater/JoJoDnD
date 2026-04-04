import PageTitle from "@/app/Components/Layout/Typography/PageTitle";
import EditorClient from "./Components/EditorClient";

export default function CharacterEditorPage() {
  return (
    <div className="w-full h-full mb-4 flex relative">
      <div className="w-full">
        <PageTitle title="Character Sheet Editor"/>
        <div className="content relative h-full">
          <div className="absolute top-0 left-0 pl-4 pt-4 w-full flex flex-col md:flex-row gap-2 md:gap-4 mb-4 md:items-center">
            <EditorClient/>
          </div>
        </div>
      </div>
    </div>    
  );
}