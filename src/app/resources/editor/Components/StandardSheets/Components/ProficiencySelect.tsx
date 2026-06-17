"use client";

import Select from "@/app/Components/Layout/Forms/Controlled/Select";
import { DetailedHTMLProps, SelectHTMLAttributes, useEffect, useState } from "react";

//TODO: consider replacing this with an open-entry field for more flexibility
export default function ProficiencySelect(props: DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>) {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    switch (props.value) {
      case "on":
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
    <Select {...props} value={value ?? ""} className={`text-[10px] text-center border-1 appearance-none ${props.className}`}>
      <option value=""/>
      {Array.from({length: 10}).map((_, i) => {
        const mult = `x${i+1}`;
        return (
          <option key={`prof-${props.name}-${mult}`} value={mult}>
            {mult}
          </option>
        )})}
    </Select>
  );
}