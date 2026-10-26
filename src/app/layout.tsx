import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nutsumo — The Trusted Marketplace for Artisans",
    template: "%s · Nutsumo",
  },
  description:
    "Find verified local artisans and job opportunities. Earned trust through good work with zero fake reviews and protected payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${bricolage.variable} h-full`}>
      <body className="min-h-full bg-background font-sans antialiased text-slate-800">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
