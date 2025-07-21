"use client";

import { useEffect } from "react";

export function useResize(callback: () => void) {
  useEffect(() => {
  callback();
  window.addEventListener("resize", callback);
  });
}