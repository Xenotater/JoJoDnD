import type { Metadata } from "next";
import { Playfair, Kameron } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header/Header";
import { Suspense } from "react";

const playfair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const kameron = Kameron({
  variable: "--font-kameron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:  {
    template: "%s | JoJo D&D",
    default: "JoJo D&D"
  },
  description: "A Tabletop Game based on JoJo's Bizarre Adventure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${playfair.variable} ${kameron.variable}`}>
      <header>
        <Header/>
      </header>
        <div className="contentWrapper">
          <div className="w-full min-h-full max-w-[90vw] m-auto">
            <Suspense fallback={<div className="w-full h-full content"><svg className="animate-spin"/></div>}>
              {children}
            </Suspense>
          </div>
        </div>
      </body>
    </html>
  );
}
