"use client";

import { useEffect, useState } from "react";
import SheetForm from "../Components/SheetForm";
import { notFound } from "next/navigation";
import { Chart, RadialLinearScale, PointElement, LineElement, Tooltip, Filler } from "chart.js";
import LoadingSpinner from "@/app/Components/Layout/LoadingSpinner/LoadingSpinner";

export default function CharacterPdfPage() {
  Chart.register(RadialLinearScale, PointElement, LineElement, Tooltip, Filler);

  const [clientChecked, setClientChecked] = useState(false);
  
  useEffect(() => {
    const isPuppeteer = navigator.webdriver || 
    /HeadlessChrome/.test(window.navigator.userAgent);

    if (!isPuppeteer)
      notFound();

    setClientChecked(true);
  }, []);
  
  return clientChecked ? <SheetForm/> : <LoadingSpinner/>;
}