import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LocalHomeFix — Find reviewed local home service pros",
    template: "%s · LocalHomeFix",
  },
  description:
    "Browse reviewed local pros free, post a home repair request, compare quotes in one place, and pay the professional directly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geist.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

