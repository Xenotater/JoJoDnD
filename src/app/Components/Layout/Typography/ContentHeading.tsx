import React from "react";
import styles from "./Typography.module.css";

export default function ContentHeading(props: {children: React.ReactNode, className?: string, as?: React.ElementType}) {
  const Tag = props.as || "h2";
  return <Tag className={`${styles.contentHeading} ${props.className}`}>{props.children}</Tag>;
}