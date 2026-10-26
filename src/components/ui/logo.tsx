import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
}

export function Logo({
  variant = "light",
  size = "md",
  className,
  href = "/",
}: LogoProps) {
  const heightClasses = {
    sm: "h-7 sm:h-8",
    md: "h-[32px] sm:h-[38px]",
    lg: "h-[42px] sm:h-[40px]",
  }[size];

  const content = (
    <div
      className={cn("inline-flex items-center group select-none", className)}
    >
      <Image
        src="/logo.png"
        alt="Nutsumo"
        width={180}
        height={60}
        priority
        className={cn("w-40 h-fit object-cover", heightClasses)}
      />
    </div>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
    >
      {content}
    </Link>
  );
}
