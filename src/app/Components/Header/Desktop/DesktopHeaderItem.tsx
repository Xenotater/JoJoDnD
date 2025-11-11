import Image from "next/image";
import { HeaderItem } from "../HeaderItems.model";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useResize } from "@/app/Hooks/useResize";

export default function DesktopHeaderItem({item}: {item: HeaderItem}) {
  const path = usePathname();

  const [screenWidth, setScreenWidth] = useState(1200);
  const shrinkWidth = 1149;

  useResize(() => setScreenWidth(window.innerWidth));

  return (
    <Link className={`flex flex-col justify-end items-center gap-2 p-2 pb-0 text-sky-200 hover:text-sky-300  ${path.includes(item.link) ? "bg-jj-purple-3 hover:bg-jj-purple-4" : "hover:bg-jj-purple-2"}`} href={item.link}>
      <Image src={`/images/nav/${item.icon}.webp`} alt={item.icon} width={screenWidth > shrinkWidth ? 50 : 45} height={screenWidth > shrinkWidth ? 50 : 45}/>
      <span className={screenWidth > shrinkWidth ? "text-xl" : "text-md"}>{item.name}</span>
    </Link>
  );
}