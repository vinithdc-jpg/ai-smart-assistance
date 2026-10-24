import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import RouteChangeLoader from "@/components/RouteChangeLoader";
import ToastProvider from "@/components/ToastProvider";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Ledger AI Assistant",
  description: "Staff portal for member insights, payments, and AI chat",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full antialiased ${geistSans.variable} ${geistMono.variable} font-sans ${inter.variable}`}
    >
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans dark:bg-background dark:text-foreground">
        <Suspense fallback={null}>
          <RouteChangeLoader />
        </Suspense>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
