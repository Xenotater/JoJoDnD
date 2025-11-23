"use client";

import IconButton from "@/app/Components/Layout/IconButton/IconButton";
import { useState } from "react";
import { BsList } from "react-icons/bs";

export default function CommunityMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <IconButton onClick={() => setMenuOpen(!menuOpen)} className="bg-jj-purple-1">
        <BsList className="text-white" size="24"/>
      </IconButton>
    </div>
  );
}