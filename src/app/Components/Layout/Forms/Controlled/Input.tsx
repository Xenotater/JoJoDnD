import { useEffect, useState } from "react";

export default function Input(props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  const [val, setVal] = useState(props.value ?? "");

  useEffect(() => {
    setVal(props.value ?? "");
  }, [props.value]);

  return (
    <input {...props} value={val} onChange={(e) => {setVal(e.target.value); if (props.onChange) props.onChange(e)}} >
      {props.children}
    </input>
  );
}