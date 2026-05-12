"use client";

import { ToastOptions } from "./ToastControllerProvider";

import styles from "./Toast.module.css";
import { BsX } from "react-icons/bs";

export default function Toast({message, options, closing, closeCallback}: {message: string, options?: ToastOptions, closing: boolean; closeCallback: () => void}) {
  return (
    <div className={`${styles[`toast${options?.type ?? "Generic"}`]} relative border-2 rounded-md shadow-md/50 p-2 text-lg flex justify-center items-center w-200px ${closing ? "animate-fade" : ""} ${options?.className ?? ""}`}>
      {options?.canClose && 
        <div className="absolute top-[-8px] right-[-8px] flex items-center">
          <div className="p-1.5 bg-jj-purple-1 border rounded-[50%] cursor-pointer hover:shadow-sm/33 z-2">
            <BsX size={20} color="red" onClick={closeCallback}/>
          </div>
        </div>
      }
      {message}
    </div>
  );
}