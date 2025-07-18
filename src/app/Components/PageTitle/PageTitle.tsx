import FancyDivider from "../Divider/FancyDivider";

export default function PageTitle({title}: {title: string}) {
  return (
    <div className="flex flex-col items-center w-full mb-4">
      <h1>{title}</h1>
      <FancyDivider/>
    </div>
  );
}