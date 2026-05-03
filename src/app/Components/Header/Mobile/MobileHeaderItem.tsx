import { HeaderItem } from "../HeaderItems.model";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "../Header.module.css";
import { useTranslations } from "next-intl";

export default function MobileHeaderItem({item}: {item: HeaderItem}) {
  const path = usePathname();
  const t = useTranslations("Common");

  return (
    <Link className={`${styles.mobileMenuItem} flex items-center gap-4 p-2 text-sky-200 hover:text-sky-300  ${path.includes(item.link) ? "bg-jj-purple-3 hover:bg-jj-purple-4" : "hover:bg-jj-purple-2"}`}  href={item.link}>
      <Image src={`/images/nav/${item.icon}.webp`} alt={item.icon} width={25} height={25}/>
      <span className="text-2xl">{t(item.name)}</span>
    </Link>
  );
}