"use client";

import Select from "@/app/Components/Layout/Forms/Controlled/Select";
import { DetailedHTMLProps, SelectHTMLAttributes, useEffect, useState } from "react";

export default function ProficiencySelect(props: DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>) {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    switch (props.value) {
      case "p":
        setValue("x1");
        break;
      case "e":
        setValue("x2");
        break;
      case "m":
        setValue("x3");
        break;
      default:
        setValue(props.value);
    }
  }, [props.value])

  return (
    <Select {...props} value={value} defaultValue="" className={`text-[10px] text-center border-1 appearance-none ${props.className}`}>
      <option value=""/>
      {Array.from({length: 11}).map((_, i) => {
        const mult = i == 0 ? "x.5" : `x${i}`;
        return (
          <option key={`prof-${props.name}-${mult}`} value={mult}>
            {mult}
          </option>
        )})}
    </Select>
  );
}