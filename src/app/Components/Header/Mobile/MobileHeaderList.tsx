import styles from "../Header.module.css";
import {headerItems} from "../HeaderItems.model";
import MobileHeaderItem from "./MobileHeaderItem";

export default function MobileHeaderList() {
  return (
    <div className={`${styles.mobileMenu} relative flex flex-col shrink-0 shadow-md/60 row-span-2`}>
      {headerItems.map((item) => (
        <MobileHeaderItem key={item.name} item={item} />
      ))}
    </div>
  );
}
