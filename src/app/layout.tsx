import type { Metadata } from "next";
import { Playfair, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header/Header";

const pf = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const pfDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JoJo D&D",
  description: "A JJBA Tabletop Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pf.variable} ${pfDisplay.variable}`}>
      <header>
        <Header/>
      </header>
        <div className="contentWrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
