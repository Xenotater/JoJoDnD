import Link from "next/link";
import { doGetPatrons } from "./patreon.utility";

export default async function PatreonList() {
  const list = await doGetPatrons();

  return (
    <p>
      Huge thanks to our supporters: {
        list.map(((p, i) => <span key={p.id}>{`${p.name}${i+1 < list.length ? ", " : ""}`}</span>))
      }
      <br/>
      Want to support us? Check out our <Link  href="https://www.patreon.com/user/posts?u=122316948">Patreon</Link>!
    </p>
  );
}