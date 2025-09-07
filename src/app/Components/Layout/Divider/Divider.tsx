import styles from "./divider.module.css";

export default function Divider({isVertical, className}: {isVertical?: boolean, className?: string}) {
	return (
		<div className={`${isVertical ? styles.verticalDivider : styles.divider} ${className}`}></div>
	);
}
