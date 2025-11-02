import {categories} from "@/../public/data/familiars.json";
import FamiliarsContent from "./[item]/Components/FamiliarsContent";

export default async function FamiliarsPage() {

  return (
    <div className="content grow min-h-[40vh]">
      <FamiliarsContent data={categories.info}/>
    </div>
  );
}