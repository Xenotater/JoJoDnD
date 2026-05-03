"use client";

import {useCookies} from "next-client-cookies";
import {useRouter} from "next/navigation";

export default function LangSelector({className}: {className?: string}) {
  const router = useRouter();
  const cookies = useCookies();
  const lang = cookies.get("NEXT_LOCALE");

  const updateLang = async (lang: string) => {
    const date = new Date();
    const expireMs = 100 * 24 * 60 * 60 * 1000; // 100 days
    date.setTime(date.getTime() + expireMs);
    cookies.set("NEXT_LOCALE", lang, {expires: date, path: "/"});
    router.refresh();
  };

  return (
    <div className={className}>
      <span>Lang:</span>
      <select className="bg-jj-mpurple-1 text-black appearance-none border-1 border-white ml-1 px-1" value={lang} onChange={(e) => updateLang(e.target.value)}>
        <option value="en">en</option>
        <option value="fr">fr</option>
        <option value="uk">uk</option>
        <option value="ru">ru</option>
      </select>
    </div>
  );
}
