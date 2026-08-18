import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavLinks from "@/app/ui/nav-links";
import { auth } from "@/auth";
import HeaderAuth from "./ui/header.auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub Insights Dashboard",
  description: "Search GitHub repos and track your favorites",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-zinc-900" />
                <span className="text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
                  GitHub Insights
                </span>
              </div>
              <div className="flex items-center sm:hidden">
                <HeaderAuth />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 sm:contents">
              <NavLinks />
              <div className="hidden sm:block">
                <HeaderAuth />
              </div>
            </div>
          </div>
        </nav>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}