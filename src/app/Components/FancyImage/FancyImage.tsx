import Image, { ImageProps } from "next/image";

import styles from "./FancyImage.module.css";

interface FancyImageProps extends ImageProps {
	type: "border" | "popout"
}

export function FancyImage(props: FancyImageProps) {
	return <Image className={`${styles[`${props.type}Img`]} ${props.className}
	${props.className?.includes("w-") ? "" : "w-auto"} ${props.className?.includes("h-") ? "" : "h-auto"}`}
	src={props.src} alt={props.alt} width={0} height={0} sizes="100vw"/>
}
