import type { Metadata } from "next";
import { Public_Sans } from "next/font/google"; // Changed from Geist
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Murat Sitesi Dashboard",
  description: "Kentsel Dönüşüm Takip Platformu",
  robots: "noindex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${publicSans.variable} antialiased bg-background-light dark:bg-background-dark font-display text-[#1b0d0e] dark:text-white min-h-screen flex flex-col overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
