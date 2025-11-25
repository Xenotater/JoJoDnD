"use client";

import Divider from "@/app/Components/Layout/Divider/Divider";
import IconButton from "@/app/Components/Layout/IconButton/IconButton";
import Modal from "@/app/Components/Layout/Modal/Modal";
import Link from "next/link";
import { useState } from "react";
import { BsBoxArrowInRight, BsFileEarmark, BsFilePlus, BsList, BsPerson } from "react-icons/bs";

export default function CommunityMenu() {
  const loggedIn = false; //TODO: auth solution
  const [menuOpen, setMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  const toggleMenu = (state = !menuOpen) => {
    if (state) {
      setMenuOpen(true);
      setTimeout(() => setAnimate(true), 0)
    }
    else {
      setAnimate(false);
      setTimeout(() => setMenuOpen(false), 100);
    }
  }

  return (
    <Modal closeCallback={() => toggleMenu(false)}>
      <div>
        <IconButton onClick={() => toggleMenu()} className="bg-jj-purple-1 relative z-2">
          <BsList className="text-white" size="24"/>
        </IconButton>
        {menuOpen && 
            <div className={`absolute top-[42px] left-[16px] z-1 transform transition duration-100 ${animate ? "scale-100" : "scale-0"}`}>
              <div className="w-[44px] h-[60px] aspect-1/1 border-2 border-t-0 z-2 bg-jj-purple-1"/>
              <div className="border-2 whitespace-nowrap z-1 absolute top-[24px] rounded-lg rounded-tl-4xl bg-jj-purple-1 p-2 shadow-md/30">
                {loggedIn ? 
                  <>
                    <Link href="" className="flex gap-2 text-white items-center hover:underline">
                      <BsPerson size={20}/><span>Account</span>
                    </Link>
                    <Divider className="border-white mb-2 mt-2"/>
                    <Link href="" className="flex gap-2 text-white items-center hover:underline">
                      <BsFileEarmark size={20}/><span>Your Resources</span>
                    </Link>
                    <Divider className="border-white mb-2 mt-2"/>
                    <Link href="" className="flex gap-2 text-white items-center hover:underline">
                      <BsFilePlus size={20}/><span>Submit New Resource</span>
                    </Link>
                  </>
                : <>
                  <Link href="" className="flex gap-4 whitespace-normal w-[200px] items-center text-white hover:underline">
                    <BsBoxArrowInRight size={28} className="shrink-0"/><span>Sign in to manage and submit resources</span>
                  </Link>
                </>  
              }
              </div>
            </div>
        }
      </div>
    </Modal>
  );
}