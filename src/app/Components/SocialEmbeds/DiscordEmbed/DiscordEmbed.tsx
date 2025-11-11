import { SocialEmbedBase } from "../SocialEmbedBase";
import { doGetDiscordDetails } from "../socials.utility";

export default async function DiscordEmbed() {
  const discordInfo = await doGetDiscordDetails();
  
  if (!discordInfo)
    return <></>;

  return (
    <SocialEmbedBase
      link={"https://discord.gg/nmgSjPW8xs"} name={discordInfo.guild.name}
      prompt="Join Our Community Discord!" logo={"/images/socials/discord.webp"}
      members={discordInfo.approximate_member_count} active={discordInfo.approximate_presence_count}
      icon={`https://cdn.discordapp.com/icons/${discordInfo.guild.id}/${discordInfo.guild.icon}.gif`}
    />
  );
}