"use client";

import { useEffect, useRef, useState } from "react";
import { Textfit } from "react-textfit";

import styles from "./ScalingInput.module.css";

export default function ScalingInput(props: {className?: string, fontmin?: number, fontmax?: number} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [editing, setEditing] = useState(false);
  const [hovering, setHovering] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
      const text = textRef.current;

    const toggleEdit = (state: boolean) => {
      setEditing(state);
      if (inputRef.current && state)
        inputRef.current.focus();
    };
    const toggleHover = (state: boolean) => {
      setHovering(state);
    };

    if (input) {
      input.addEventListener("blur", () => toggleEdit(false));
      input.addEventListener("focus", () => toggleEdit(true));
      input.addEventListener("mouseleave", () => toggleHover(false));
    }

    if (text) {
      text.addEventListener("focus", () => toggleEdit(true));
      text.addEventListener("mouseenter", () => toggleHover(true));
    }

    return(() => {
      if (input) {
        input.removeEventListener("blur", () => toggleEdit(false));
        input.removeEventListener("focus", () => toggleEdit(true));
        input.removeEventListener("mouseleave", () => toggleHover(false));
      }

      if (text) {
        text.removeEventListener("focus", () => toggleEdit(true));
        text.removeEventListener("mouseenter", () => toggleHover(true));
      }
    });

  }, [inputRef, textRef]);

  return (
    <>
      <input {...props} ref={inputRef} className={`${props.className} ${editing || hovering ? "" : styles.hidden}`}/>
      <div ref={textRef} tabIndex={0} className={`${props.className} ${editing || hovering ? styles.hidden : ""}`}>
        {!(editing || hovering) && 
          <Textfit className={styles.inherit} max={props.fontmax} min={props.fontmin}>{props.value}</Textfit>
        }
      </div>
    </>
  );
}