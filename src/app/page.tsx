import Image from "next/image";
import styles from "./page.module.css";
import Divider from "./Components/Divider/Divider";

export default function Home() {
  return (
    <div>
      <div className={styles.mainHeading}>
        <Image src="/logo/logo.webp" alt="JoJoDnD Logo" width={600} height={250}/>
        <h1>A Tabletop Game based on JoJo&apos;s Bizarre Adventure</h1>
        <Divider/>
      </div>
      <div className="content">
        <h2>This is some test content</h2>
        <p>Test content description is awesome, you&apos;re so cool Kyler. Great job on this whole rewrite thing, you&apos;re really giving it your all. It&apos;s going to take awhile, but it&apos;ll definitely be worth it in the end. Huge increase in QoL for users and lots of new fancy functionality. Not to mention that the code will look much better and be more maintainable. It&apos;ll be great resume material now instead of looking like a class project, which to be fair the last iteration was. Man this is taking awhile to type, and I&apos;m making lots of mistakes. Well whatever, this should be enough. Test content description is awesome.</p>
      </div>
    </div>
  );
}
