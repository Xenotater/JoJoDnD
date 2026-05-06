import { useEffect, useState } from "react";

export default function Textarea(props: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>) {
  const [val, setVal] = useState(props.value ?? "");

  useEffect(() => {
    setVal(props.value ?? "");
  }, [props.value]);

  return (
    <textarea {...props} value={val} onChange={(e) => {setVal(e.target.value); if (props.onChange) props.onChange(e)}} >
      {props.children}
    </textarea>
  );
}