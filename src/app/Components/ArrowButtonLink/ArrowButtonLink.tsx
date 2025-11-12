import Link, { LinkProps } from "next/link";

import styles from "./ArrowButtonLink.module.css";

export default function ArrowButtonLink(props: LinkProps & {children?: React.ReactNode, className?: string}) {
  return <div className={`${styles.arrowWrapper} flex`}><Link {...props} className={`${styles.arrowLink} ${props.className}`}>{props.children}</Link></div>;
}