"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./ToggleSwitch.module.css";

export default function ToggleSwitch({value, callback, width, onColor, offColor, borderColor, className}: {value: boolean, callback?: (value?: boolean) => void, onColor?: string, offColor?: string, borderColor?: string, width?: number, className?: string}) {
  const [val, setVal] = useState(value);
  const checkRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const toggle = () => {
    if (checkRef.current)
      checkRef.current.click();
  }

  return (
    <div className={`${styles.toggleSwitch} relative inline-block ${className}`} onClick={() => toggle()}
        style={{"--width": `${width ?? 60}px`, "--on": `${onColor ?? "purple"}`, "--off": `${offColor ?? "#bbb"}`, "--border": `${borderColor ?? "transparent"}`} as React.CSSProperties}>
      <input ref={checkRef} type="checkbox" checked={val} onChange={(e) => {setVal(e.target.checked); if (callback) callback(e.target.checked);}} className="hidden"/>
      <div className={styles.toggleSlider}/>
    </div>
  );
}