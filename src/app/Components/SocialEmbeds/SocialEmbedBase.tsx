import Image from "next/image";
import styles from "./SocialEmbed.module.css";
import Link from "next/link";

interface SocialEmbedBaseProps {
	link: string;
	name: string;
	prompt: string;
	members: number;
	active: number;
	icon: string;
	logo: string;
}

export function SocialEmbedBase(props: SocialEmbedBaseProps) {
	return (
		<Link className={`${styles.socialEmbedBase}`} href={props.link}>
			<div className="flex justify-between">
				<span className="text-[mediumslateblue] text-sm">{props.prompt}</span>
				<Image src={props.logo} alt="social logo" width={25} height={25}/>
			</div>
			<div className="flex items-center justify-between">
				<Image className="rounded-[50%]" src={props.icon} alt="social icon" width={65} height={65}/>
				<div className="flex flex-col text-center m-auto">
					<b className="text-[mediumpurple] text-2xl leading-6">{props.name}</b>
					<span className="text-[darkgray] text-sm">{props.members} Members, {props.active} Online</span>
				</div>
			</div>
		</Link>
	);
}
