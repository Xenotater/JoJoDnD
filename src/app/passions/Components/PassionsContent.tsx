import Divider from "@/app/Components/Layout/Divider/Divider";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { PassionData } from "@/app/Models/Passions.model";
import { abilityFromAbbr } from "@/app/Utilities/misc.utility";

export default function PassionsContent({data}: {data: PassionData | undefined}) {
  if (!data)
    return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>

  //TODO: consider removing this and hardcoding the text into the data file?
  const parseASI = () => {
    let text = "Your ";
    const increases = data.stats.split(", ");
    const stats: string[] = [], values: string[] = [];
    increases.forEach((increase) => {
      //format is "Stat +Value"
      stats.push(increase.split(" ")[0]);
      values.push(increase.split(" ")[1].substring(1));
    });
  
    //all increase by same amount
    if ([...new Set(values)].length === 1)
    {
      stats.forEach((stat, i) => {
        text += abilityFromAbbr(stat.toLowerCase());
        if (i + 2 == stats.length)
          text += ", and ";
        else if (i + 1 < stats.length)
          text += ", ";
      });
      text += ` Scores increase by ${values[0]}.`;
    }

    //different amounts
    else {
      stats.forEach((stat, i) => {
        text += `${abilityFromAbbr(stat.toLowerCase())} Score increases by ${values[i]}`;
        if (i + 2 == stats.length)
          text += ", and your ";
        else if (i + 1 < stats.length)
          text += ", your ";
      });
      text += ".";
    }

    return text;
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <div className="md:w-[30%] min-w-min shrink-0">
        <ContentHeading className="underline">{data.name}</ContentHeading>
        <p>{data.desc}</p>
        <ContentHeading as={"h4"} className="text-2xl mt-4">Examples</ContentHeading>
        <ul className="list-disc">
          {data.examples.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
      <Divider className="hidden md:block" isVertical={true}/>
      <Divider className="md:hidden"/>
      <div className="grow">
        <ContentHeading className="underline" as={"h3"}>{`${data.name} Traits`}</ContentHeading>
        <div className="flex flex-col gap-4 mt-4">
        <p><b><u>Saving Throws:</u></b> {data.saves}</p>
        <p><b><u>Ability Score Increase:</u></b> {data.ability ? data.ability : parseASI()}</p>
        <p><b><u>{data.custom.name}:</u></b> {`${data.custom.desc} Alternatively, you may choose to forgo one of these Proficiencies to instead gain ${data.alt}`}</p>
        <p><b><u>Additional Proficiencies:</u></b> {`You gain an additional amount of Proficiencies of your choice equal to your Proficiency Bonus.`}</p>
        </div>
      </div>
    </div>
  )
}