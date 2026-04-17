"use client";

import { useEffect, useRef, useState } from "react";
import { Textfit } from "react-textfit";

import styles from "./ScalingInput.module.css";

export default function ScalingInput(props: {className?: string, fontMin?: number, fontMax?: number} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [editing, setEditing] = useState(false);
  const [hovering, setHovering] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const toggleEdit = (state: boolean) => {
      console.log("edit: " + state);
      setEditing(state);
      if (inputRef.current && state)
        inputRef.current.focus();
    };
    const toggleHover = (state: boolean) => {
      console.log("hover: " + state);
      setHovering(state);
    };

    if (inputRef.current) {
      const input = inputRef.current;
      input.addEventListener("blur", () => toggleEdit(false));
      input.addEventListener("focus", () => toggleEdit(true));
      input.addEventListener("mouseleave", () => toggleHover(false));
    }

    if (textRef.current) {
      const text = textRef.current;
      text.addEventListener("focus", () => toggleEdit(true));
      text.addEventListener("mouseenter", () => toggleHover(true));
    }

  }, [inputRef, textRef]);

  return (
    <>
      <input {...props} ref={inputRef} className={`${props.className} ${editing || hovering ? "" : styles.hidden}`}/>
      <div ref={textRef} tabIndex={0} className={`${props.className} ${editing || hovering ? styles.hidden : ""}`}>
        {!(editing || hovering) && 
          <Textfit className={styles.inherit} max={props.fontMax} min={props.fontMin}>{props.value}</Textfit>
        }
      </div>
    </>
  );
}