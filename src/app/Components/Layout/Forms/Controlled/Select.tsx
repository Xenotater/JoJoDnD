import { useEffect, useState } from "react";

export default function Select(props: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>) {
  const [val, setVal] = useState(props.value ?? "");

  useEffect(() => {
    setVal(props.value ?? "");
  }, [props.value]);

  return (
    <select {...props} value={val} onChange={(e) => {setVal(e.target.value); if (props.onChange) props.onChange(e)}} >
      {props.children}
    </select>
  );
}