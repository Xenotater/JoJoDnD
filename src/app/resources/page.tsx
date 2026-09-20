import { BsArrowRight, BsCardList, BsDownload, BsEye, BsFileEarmarkPerson, BsFileEarmarkText, BsPeople } from "react-icons/bs";
import PageTitle from "@/app/Components/Layout/Typography/PageTitle";
import ResourceItem from "./Components/ResourceItem";
import { getLatestFileName } from "@/app/Utilities/files.utility";
import Link from "next/link";
import ArrowButtonLink from "@/app/Components/Layout/ArrowButtonLink/ArrowButtonLink";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import Divider from "@/app/Components/Layout/Divider/Divider";
import ContactForm from "./Components/ContactForm";
import { getTranslations } from "next-intl/server";

export default async function ResourcesPage() {
  const pdfPath = "@/../public/static/resources/PDFs";
  const pdfName = await getLatestFileName(pdfPath, "Version");
  const t = await getTranslations("Resources");

  return (
    <div className="w-full h-full">
      <PageTitle title="Resources"/>
      <div className="w-full h-full content flex flex-col mb-4">
        <ResourceItem icon={<BsFileEarmarkText className="shrink-0" size="75"/>} title={t("pdfVersion")} desc={[
          t("pdfDesc1"),
          t("pdfDesc2", {linkOpen: `<a target="_blank" href='/resources/files?path=/static/resources/PDFs&sort=version'>`, linkClose: "</a>"})
        ]}>
          <div className="h-full flex flex-col justify-center items-center text-lg">
            <h4>{pdfName}</h4>
            <div className="flex">
              <a className="button flex gap-1 items-center rounded-l-sm bg-gray-200 hover:bg-gray-300" href={`/static/resources/PDFs/${pdfName}`} target="_blank">
                <BsEye/>{t("view")}
              </a>
              <a className="button flex gap-1 items-center rounded-r-sm border-l-0 bg-gray-200 hover:bg-gray-300" href={`/static/resources/PDFs/${pdfName}`} target="_blank" download>
                <BsDownload/>{t("download")}
              </a>
            </div>
          </div>
        </ResourceItem>
        <ResourceItem icon={<BsFileEarmarkPerson className="shrink-0" size="75"/>} title={t("sheets")} desc={[
          t("sheetsDesc"),
        ]}>
          <div className="h-full flex flex-col justify-center items-center text-lg">
            <h4>JoJo_Char_Sheet.pdf</h4>
            <div className="flex">
              <a className="button flex gap-1 items-center rounded-l-sm bg-gray-200 hover:bg-gray-300" href={`/static/resources/JoJo_Char_Sheet.pdf`} target="_blank">
                <BsEye/>{t("view")}
              </a>
              <a className="button flex gap-1 items-center rounded-r-sm border-l-0 bg-gray-200 hover:bg-gray-300" href={`/static/resources/JoJo_Char_Sheet.pdf`} target="_blank" download>
                <BsDownload/>{t("download")}
              </a>
            </div>
            <Link href="/resources/editor" className="button rounded bg-jj-purple-1 text-white flex items-center gap-2 mt-2">{t("create")} <BsArrowRight/></Link>
          </div>
        </ResourceItem>
        <ResourceItem icon={<BsPeople className="shrink-0" size="75"/>} title={t("community")} desc={[
          t("communityDesc1"),
          t("communityDesc2")
        ]}>
          <div className="flex w-full h-full justify-center items-center">
            <ArrowButtonLink href="/resources/community" className="h-full min-h-[75px] max-h-[150px] aspect-3/2"/>
          </div>
        </ResourceItem>
        <ResourceItem icon={<BsCardList className="shrink-0" size="75"/>} title={t("patch")} desc={[
          t("patchDesc")
        ]}>
          <div className="flex w-full h-full justify-center items-center">
            <ArrowButtonLink href="/resources/patches" className="h-full min-h-[75px] max-h-[150px] aspect-3/2"/>
          </div>
        </ResourceItem>
        <div className="flex flex-col gap-2 mb-4 text-center">
          <ContentHeading as="h2" className="m-0 leading-[36px]">{t("example")}</ContentHeading>
          <p className="mb-2">{t("exampleDesc")}</p>
          <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-evenly">
            <div dir="rtl" className="rounded-lg drop-shadow-black drop-shadow-xl overflow-x-scroll hideScroll w-full md:w-[45%] max-w-[560px] h-[100px] sm:h-[232px] md:h-[152px] lg:h-[232px]">
              <iframe className="h-full min-w-[330px] w-full" src="https://open.spotify.com/embed/episode/44ZYj9hjlzvxTpdsWsJ4sc?utm_source=generator&amp;theme=0"
                frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"/>
            </div>
            <iframe className="rounded-lg drop-shadow-black drop-shadow-xl w-full md:w-[45%] max-w-[560px] aspect-16/9" src="https://www.youtube.com/embed/videoseries?list=PLndOd2vtwL7L00BUuNn3r4Gtkap7nu0PJ"
              title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
          </div>
        </div>
        <Divider/>
        <ContactForm/>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Resources",
  description: "Helpful resources for JoJo's Bizarre Tabletop Game"
}