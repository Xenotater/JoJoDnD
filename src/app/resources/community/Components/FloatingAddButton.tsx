"use client";

import IconButton from "@/app/Components/Layout/IconButton/IconButton";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import NewResourceForm from "./NewResourceForm";

export default function FloatingAddButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="right-0 w-0">
      <div className="h-70 sm:h-60"/>
      <IconButton onClick={() => setModalOpen(!modalOpen)} className="sticky top-10 sm:top-20 p-0.5 ml-[-18px] sm:ml-[-25px] text-2xl sm:text-4xl bg-jj-purple-1 text-white">
        <BsPlus/>
      </IconButton>
      {modalOpen &&
        <NewResourceForm closer={() => setModalOpen(false)}/>
      }
    </div>
  );
}