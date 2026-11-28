import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { photos } from "@/lib/media";

/**
 * Fiverr-style inner-page hero: breadcrumb on white, then a large rounded
 * burgundy banner with a photo fading in from the right. Leaves room for the
 * fixed navbar. `children` renders under the description (e.g. a search box,
 * as on the FAQ page).
 */
export function PageBanner({
  eyebrow,
  title,
  description,
  image,
  align = "left",
  breadcrumbs,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  align?: "left" | "center";
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
  children?: ReactNode;
}) {
  const centered = align === "center";
  const crumbs = breadcrumbs ?? [
    { label: "Home", href: "/" },
    { label: eyebrow ?? title },
  ];

  return (
    <section className={cn("bg-white pt-24 sm:pt-28", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-copy">
          <ol className="flex flex-wrap items-center gap-1.5">
            {crumbs.map((crumb, idx) => (
              <li key={idx} className="inline-flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-primary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-title" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="relative mt-4 overflow-hidden rounded-3xl bg-[#2A0A12]">
          <div className={cn("absolute inset-y-0 right-0", centered ? "left-0" : "left-0 md:left-[38%]")}>
            <Image
              src={image ?? photos.banner}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 70vw, 100vw"
              className="object-cover"
            />
          </div>
          <div
            className={cn(
              "absolute inset-0",
              centered
                ? "bg-[#2A0A12]/75"
                : "bg-[#2A0A12]/80 md:bg-transparent md:bg-linear-to-r md:from-[#2A0A12] md:from-40% md:via-[#2A0A12]/70 md:to-[#2A0A12]/5",
            )}
          />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />

          <div
            className={cn(
              "relative px-6 py-12 sm:px-12 sm:py-16 lg:py-20",
              centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
            )}
          >
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.1] text-white! sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className={cn("mt-4 max-w-xl text-base text-white/75 sm:text-lg", centered && "mx-auto")}>
                {description}
              </p>
            ) : null}
            {children ? <div className="mt-8">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
