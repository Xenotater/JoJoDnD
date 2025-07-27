"use client";

import { useEffect, useRef, useState } from "react";
import { BsArrowUp } from "react-icons/bs";

import styles from "./ToTopButton.module.css";

export default function ToTopButton() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollLimit, setScrollLimit] = useState(0);
  const scrollCheck = useRef(false);

  const getContentWrapper = () => document.querySelector(".contentWrapper");

  useEffect(() => {
    const elem = getContentWrapper();
    if (!elem)
      return;

    const handleScroll = () => {
      setScrollPosition(elem.scrollTop);
    }

    setScrollLimit(elem.clientHeight / 2);
    elem.addEventListener("scroll", handleScroll, {passive: true})
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    scrollCheck.current = scrollPosition > scrollLimit;
  }, [scrollPosition, scrollLimit])

  return (
    <>
      {scrollCheck.current &&
      <button className={styles.topButton} onClick={() => getContentWrapper()?.scroll({top: 0, behavior: "smooth"})}>
        <BsArrowUp/>
      </button>
      }
    </>
  );
}