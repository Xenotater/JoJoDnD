import { SocialEmbedBase } from "../SocialEmbedBase";
import { doGetRedditDetails } from "../socials.utility";

export default async function RedditEmbed() {
  const redditInfo = await doGetRedditDetails();
  
  if (!redditInfo)
    return <></>;

  return (
    <SocialEmbedBase
      link={"https://www.reddit.com/r/jojodnd"} name={redditInfo.data.display_name_prefixed}
      prompt="Join Our Subreddit!" logo={"/images/socials/reddit.webp"}
      members={redditInfo.data.subscribers} active={redditInfo.data.active_user_count}
      icon={redditInfo.data.community_icon.replace(/\?.*/, "")}
    />
  );
}