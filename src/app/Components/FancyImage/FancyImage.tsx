import Image, { ImageProps } from "next/image";

import styles from "./FancyImage.module.css";

interface FancyImageProps extends ImageProps {
	type: "border" | "popout"
}

export function FancyImage(props: FancyImageProps) {
	return <Image className={`${styles[`${props.type}-img`]} ${props.className}`} src={props.src} alt={props.alt} width={props.width} height={props.height} />
}
