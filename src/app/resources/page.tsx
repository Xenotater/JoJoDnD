import { BsArrowRight, BsCardList, BsDownload, BsEye, BsFileEarmarkPerson, BsFileEarmarkText, BsPeople } from "react-icons/bs";
import PageTitle from "../Components/Layout/Typography/PageTitle";
import ResourceItem from "./Components/ResourceItem";
import { getLatestFileName } from "../Utilities/files.utility";
import Link from "next/link";
import ArrowButtonLink from "../Components/Layout/ArrowButtonLink/ArrowButtonLink";
import ContentHeading from "../Components/Layout/Typography/ContentHeading";
import Divider from "../Components/Layout/Divider/Divider";
import ContactForm from "./Components/ContactForm";

export default async function ResourcesPage() {
  const pdfPath = "@/../public/static/resources/PDFs";
  const pdfName = await getLatestFileName(pdfPath, "Version");

  return (
    <div className="w-full h-full">
      <PageTitle title="Resources"/>
      <div className="w-full h-full content flex flex-col mb-4">
        <ResourceItem icon={<BsFileEarmarkText className="shrink-0" size="75"/>} title="PDF Version" desc={[
          "The PDF version of the system, for those who prefer a physical or offline format with everything in one place.",
          "If desired, you can also find older versions of the system <a href='/resources/patches'>here</a>."
        ]}>
          <div className="h-full flex flex-col justify-center items-center text-lg">
            <h4>{pdfName}</h4>
            <div className="flex">
              <a className="button flex gap-1 items-center rounded-l-sm bg-gray-200 hover:bg-gray-300" href={`/static/resources/PDFs/${pdfName}`} target="_blank">
                <BsEye/>View
              </a>
              <a className="button flex gap-1 items-center rounded-r-sm border-l-0 bg-gray-200 hover:bg-gray-300" href={`/static/resources/PDFs/${pdfName}`} target="_blank" download>
                <BsDownload/>Download
              </a>
            </div>
          </div>
        </ResourceItem>
        <ResourceItem icon={<BsFileEarmarkPerson className="shrink-0" size="75"/>} title="Character Sheets" desc={[
          "Print off one of our custom character sheets, or use our online character editor!",
        ]}>
          <div className="h-full flex flex-col justify-center items-center text-lg">
            <h4>JoJo_Char_Sheet.pdf</h4>
            <div className="flex">
              <a className="button flex gap-1 items-center rounded-l-sm bg-gray-200 hover:bg-gray-300" href={`/static/resources/JoJo_Char_Sheet.pdf`} target="_blank">
                <BsEye/>View
              </a>
              <a className="button flex gap-1 items-center rounded-r-sm border-l-0 bg-gray-200 hover:bg-gray-300" href={`/static/resources/JoJo_Char_Sheet.pdf`} target="_blank" download>
                <BsDownload/>Download
              </a>
            </div>
            <Link href="/resources/editor" className="button rounded bg-jj-purple-1 text-white flex items-center gap-2 mt-2">Create your own <BsArrowRight/></Link>
          </div>
        </ResourceItem>
        <ResourceItem icon={<BsPeople className="shrink-0" size="75"/>} title="Community Resources" desc={[
          "Check out some of the awesome resources and homebrew made by members of our community!",
          "You can also post your own resources to share with others."
        ]}>
          <div className="flex w-full h-full justify-center items-center">
            <ArrowButtonLink href="/resources/community" className="h-full min-h-[75px] max-h-[150px] aspect-3/2"/>
          </div>
        </ResourceItem>
        <ResourceItem icon={<BsCardList className="shrink-0" size="75"/>} title="Patch Notes" desc={[
          "We're constantly working to improve this system, taking suggestions and making updates every few months or so. Check here to keep up with the changes we make."
        ]}>
          <div className="flex w-full h-full justify-center items-center">
            <ArrowButtonLink href="/resources/patches" className="h-full min-h-[75px] max-h-[150px] aspect-3/2"/>
          </div>
        </ResourceItem>
        <div className="flex flex-col gap-2 mb-4 text-center">
          <ContentHeading as="h3">Campaign Example</ContentHeading>
          <p className="mb-2">Check out our podcast &quot;Tabletop Travesty&quot; where we&apos;ve played a campaign using an early version of this system named &quot;The Bystanders&quot;:</p>
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