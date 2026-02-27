import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RouteGuard } from "@/components/RouteGuard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Murat Sitesi Dashboard",
  description: "Kentsel Dönüşüm Takip Platformu",
  robots: "noindex",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const fullUrl = headersList.get("x-url") || "";
  // Fallback for environment where x-url might not be set by middleware
  // Usually in Next.js 15+ we can use headers to detect admin routes if middleware sets it
  // Alternatively, since RouteGuard is client-side, we can use a simpler approach here
  // But let's stick to the plan of having a predictable class.
  const isAdmin = fullUrl.includes("/admin");

  return (
    <html lang="en" className="light" suppressHydrationWarning={true}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col ${isAdmin ? 'admin-layout' : ''}`}
        suppressHydrationWarning={true}
      >
        <RouteGuard>
          <Header />
        </RouteGuard>
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
