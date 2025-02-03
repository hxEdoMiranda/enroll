import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/modules/shared/modal/provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Back Office - MEDISMART",
  description: "ENROLL 3.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0077b6] bg-gradient-to-b from-[rgba(43,20,89,0.71)] to-[rgba(255,255,255,0)]`}
        >
          <ModalProvider>{children}</ModalProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
