import Link from "next/link";
import { cn } from "@/lib/cn";
import { photos } from "@/lib/media";

export function PageBanner({
  eyebrow,
  title,
  description,
  image,
  align = "center",
  breadcrumbs,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  align?: "left" | "center";
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}) {
  const centered = align === "center";
  const crumbs = breadcrumbs ?? [
    { label: "Home", href: "/" },
    { label: eyebrow ?? title },
  ];

  return (
    <section className={cn("relative overflow-hidden bg-title text-white", className)}>
      <div
        className="absolute inset-0 bg-cover bg-[center_25%]"
        style={{ backgroundImage: `url(${image ?? photos.banner})` }}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="banner-wash absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
      <div
        className={cn(
          "container-site relative py-6 sm:py-7 md:py-8",
          centered && "mx-auto max-w-3xl text-center",
        )}
      >
        <nav
          aria-label="Breadcrumb"
          className={cn(
            "font-sans text-[11px] sm:text-xs font-medium text-white/70",
            centered && "flex justify-center",
          )}
        >
          <ol className={cn("inline-flex items-center flex-wrap gap-1.5", centered && "justify-center")}>
            {crumbs.map((crumb, idx) => (
              <li key={idx} className="inline-flex items-center">
                {idx > 0 && <span className="mx-1.5 text-white/35">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/90" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1
          className={cn(
            "mt-1.5 font-display text-[22px] font-bold leading-[1.2] tracking-tight text-white sm:text-[26px] md:text-[28px]",
            centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "mt-1 max-w-2xl font-sans text-xs sm:text-[13.5px] leading-relaxed text-white/80",
              centered && "mx-auto text-center",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}