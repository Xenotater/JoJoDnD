"use client";

import IconButton from "@/app/Components/Layout/IconButton/IconButton";
import { BsPlus } from "react-icons/bs";
import { authExecute, useAuth } from "@/app/Components/Auth/AuthContext";
import { useResourceManager } from "./ResourceManagementContext";

export default function FloatingAddButton() {
  const auth = useAuth();
  const manager = useResourceManager();

  return (
    <div className="right-0 w-0">
      <div className="h-70 sm:h-60"/>
      <IconButton onClick={() => authExecute(auth, () => manager.update())} className="sticky top-10 sm:top-20 p-0.5 ml-[-18px] sm:ml-[-25px] text-2xl sm:text-4xl bg-jj-purple-1 text-white">
        <BsPlus/>
      </IconButton>
    </div>
  );
}