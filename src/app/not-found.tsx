import { FancyImage } from "./Components/FancyImage/FancyImage";

export default function NotFound() {
  return (
    <div className="flex flex-col h-(--fullContentHeight) justify-center items-center">
      <FancyImage className="mb-8" src="/not-found/dio.webp" alt="It was I, Dio!" width={666} height={375} type={"popout"}/>
      <h3 className="text-center">
        Sorry, looks like there&apos;s nothing here. Either this page doesn&apos;t exist or you&apos;ve entered the wrong URL.
        <br></br>If you think this is an error, contact an administrator.
      </h3>
    </div>
  )
}