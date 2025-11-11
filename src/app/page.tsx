import Image from "next/image";
import styles from "./page.module.css";
import Divider from "./Components/Layout/Divider/Divider";
import Link from "next/link";
import PatreonList from "./Components/PatreonList/PatreonList";
import DiscordEmbed from "./Components/SocialEmbeds/DiscordEmbed/DiscordEmbed";
import RedditEmbed from "./Components/SocialEmbeds/RedditEmbed/RedditEmbed";

export default function Home() {
  return (
    <div>
      <div className={styles.mainHeading}>
        <Image src="/images/logo/logo.webp" alt="JoJoDnD Logo" width={600} height={250}/>
        <h1 className="text-center">A Tabletop Game based on JoJo&apos;s Bizarre Adventure</h1>
        <Divider/>
      </div>
      <div className="content">
        <h2 className="text-2xl">Including Stand Users, Vampires, Pillar Men, and more, this extensive D&D-inspired system allows you to create your very own Bizarre Adventure!</h2>
        <h5>Use the tabs at the top of the page to navigate the system&apos;s resources and create a world filled with characters with any of the races and abilities from JoJo&apos;s.</h5>
        <h5>New to the system? Start with the <Link href='/rules'>Rules</Link>.</h5>
        <Divider/>
        <div className="flex flex-col gap-2">
          <p><u>Created by Maggy Bledsoe</u>, playtested by Hayden C., Kyler Froman, Donovan Hord, Thalia Huebner, and Ty Ostrander.</p>
          <PatreonList/>
          <p><b>Character Sheets</b>, <b>Campaign Examples</b>, the <b>PDF Version</b> of the system, and more can be found on the <Link href='/resources'>Resources</Link> page.</p>
          <p>If you have any questions, comments, or want to join our community, check out our Discord and Subreddit:</p>
          <div className="flex flex-wrap justify-between items-center w-full">
            <DiscordEmbed/>
            <RedditEmbed/>
          </div>
          <p>You can also contact us through <Link href='/resources/contact'>this form</Link>.</p>
          <small>Based upon JoJo&apos;s Bizarre Adventure created by Hirohiko Araki. Inspired by Dungeons and Dragons 5th edition by Wizards of the Coast.</small>
        </div>
      </div>
    </div>
  );
}
