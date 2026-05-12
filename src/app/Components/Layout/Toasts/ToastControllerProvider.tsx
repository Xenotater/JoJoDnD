"use client";

import { createContext, useContext, useState } from "react";
import Toast from "./Toast";

export type ToastType = "Generic" | "Success" | "Error" | "Info";

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  canClose?: boolean;
  className?: string;
}

interface ToastItem {
  id: string;
  message: string;
  options?: ToastOptions;
  closing: boolean;
}

export interface ToastController {
  displayMessage: (message: string, options?: ToastOptions) => void;
}

const defaultDuration = 1000;

const ToastControllerContext = createContext<ToastController>({displayMessage: () => {}});

export const useToastController = () => useContext(ToastControllerContext);

export default function ToastControllerProvider ({children}: {children: React.ReactNode}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, options?: ToastOptions) => {
    const details: ToastItem = {
      message,
      options,
      id: crypto.randomUUID(),
      closing: false
    };

    const newToasts = [...toasts];
    newToasts.reverse();
    newToasts.push(details);
    newToasts.reverse();
    setToasts(newToasts);

    if (options?.duration == undefined || options.duration > 0)
      setTimeout(() => {
        closeToast(details.id);
      }, options?.duration ?? defaultDuration);
  };

  const closeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.map((t) => t.id == id ? {...t, closing: true} : t));
    setTimeout(() => removeToast(id), 500);
  }

  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.flatMap((t) => t.id == id ? [] : t));
  };

  return (
    <ToastControllerContext value={{
      displayMessage: (message: string, options?: ToastOptions) => {
        addToast(message, options);
      }
    }}>
      <div className="fixed bottom-4 left-4 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={`toast-${t.id}`} message={t.message} options={t.options} closing={t.closing} closeCallback={() => closeToast(t.id)}/>
        ))}
      </div>
        {children}
    </ToastControllerContext>
  );
}