import type { Metadata } from "next";
import { Outfit, Playfair } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header/Header";

const playfair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
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
      <body className={`${playfair.variable} ${outfit.variable}`}>
      <header>
        <Header/>
      </header>
        <div className="contentWrapper">
          <div className="w-full min-h-full max-w-[95vw] m-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
