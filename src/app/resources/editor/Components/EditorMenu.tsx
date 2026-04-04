"use client";

import IconButton from "@/app/Components/Layout/IconButton/IconButton";
import { BsList } from "react-icons/bs";

//TODO: will a context be needed for current resource state?
export default function EditorMenu() {
  return (
    <IconButton onClick={() => {}} className="bg-jj-purple-1 relative z-2">
      <BsList className="text-white" size="24"/>
    </IconButton>
  );
}