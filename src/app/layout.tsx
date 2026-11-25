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
    default: "Nutsumo — The Trusted Marketplace for Skilled Workers & Professionals",
    template: "%s · Nutsumo",
  },
  description:
    "Hire verified skilled workers and professionals for any job — tradespeople, chefs, drivers, nannies, security, office, creative and domestic workers. Formal or informal, every skill has a place on Nutsumo, with real reviews and protected payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} h-full`}
    >
      <body className="min-h-full bg-background font-sans antialiased text-slate-800">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
