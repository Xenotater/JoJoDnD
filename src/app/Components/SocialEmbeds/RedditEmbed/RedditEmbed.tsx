import { SocialEmbedBase } from "../SocialEmbedBase";
import { doGetRedditDetails } from "../socials.utility";

export default async function RedditEmbed() {
  const redditInfo = await doGetRedditDetails();
  
  //placeholder with less info since reddit has disabled public API access
  if (!redditInfo)
    return (
      <SocialEmbedBase
        link={"https://www.reddit.com/r/jojodnd"} name={"r/jojodnd"}
        prompt="Join Our Subreddit!" logo={"/images/socials/reddit.webp"}
        members={NaN} active={NaN}
        icon={"/images/socials/subreddit_icon.webp"}
      />
    )

  return (
    <SocialEmbedBase
      link={"https://www.reddit.com/r/jojodnd"} name={redditInfo.data.display_name_prefixed}
      prompt="Join Our Subreddit!" logo={"/images/socials/reddit.webp"}
      members={redditInfo.data.subscribers} active={redditInfo.data.active_user_count}
      icon={redditInfo.data.community_icon.replace(/\?.*/, "")}
    />
  );
}