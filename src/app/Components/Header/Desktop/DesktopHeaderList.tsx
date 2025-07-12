import { headerItems } from "../HeaderItems.model";
import DesktopHeaderItem from "./DesktopHeaderItem";

export default function DesktopHeaderList() {
  return (
    <div className="flex h-full">
      {headerItems.map((item) => <DesktopHeaderItem key={item.name} item={item}/>)}
    </div>
  )
}