import styles from "./divider.module.css";

export default function Divider({isVertical}: {isVertical?: boolean}) {
	return (
		<div className={`${isVertical ? styles.verticalDivider : styles.divider}`}></div>
	);
}
