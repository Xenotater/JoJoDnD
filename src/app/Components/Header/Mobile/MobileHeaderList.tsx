import styles from "../Header.module.css";
import { headerItems } from "../HeaderItems.model";
import MobileHeaderItem from "./MobileHeaderItem";

export default function MobileHeaderList() {
  return (
    <div className={`${styles.mobileMenu} flex flex-col absolute top-18 right-0 z-100`}>
        {headerItems.map((item) => <MobileHeaderItem key={item.name} item={item}/>)}
    </div>
  )
}