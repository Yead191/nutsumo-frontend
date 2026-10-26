import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type ProcessGridItem = {
  n: string;
  title: string;
  text: string;
  icon: LucideIcon;
};

export function ProcessGrid({
  badge,
  title,
  description,
  items,
  cta,
  className,
  introClassName,
}: {
  badge: string;
  title: string;
  description: string;
  items: ProcessGridItem[];
  cta?: { href: string; title: string; text: string; linkLabel: string };
  className?: string;
  introClassName?: string;
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>
      <div
        className={cn(
          "flex flex-col justify-center rounded-[20px] bg-smoke p-6 md:p-8 xl:min-h-[220px]",
          introClassName,
        )}
      >
        <div className="inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight text-title">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-primary"
          />
          <span>{badge}</span>
        </div>
        <h2 className="mt-4 text-[28px] leading-tight text-title md:text-[34px]">{title}</h2>
        <p className="mt-3 text-[15px] leading-6 text-copy">{description}</p>
      </div>

      {items.map((item) => (
        <article
          key={item.n + item.title}
          className="relative rounded-[20px] border border-primary/15 bg-white p-6 transition-colors hover:border-primary/40 md:p-7"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-smoke text-primary">
              <item.icon className="h-6 w-6" />
            </span>
            <span className="font-display text-[40px] font-bold leading-none text-primary/20">{item.n}</span>
          </div>
          <h3 className="mt-5 text-[18px] sm:text-[19px] font-medium text-title">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#757575]">{item.text}</p>
        </article>
      ))}

      {cta ? (
        <Link
          href={cta.href}
          className="flex flex-col justify-center rounded-[20px] border border-dashed border-primary/30 bg-smoke/60 p-6 text-center transition-colors hover:border-primary hover:bg-smoke md:p-7"
        >
          <p className="font-display text-lg font-bold text-title">{cta.title}</p>
          <p className="mt-2 text-sm leading-6 text-copy">{cta.text}</p>
          <span className="mt-4 font-display text-sm font-bold text-primary">{cta.linkLabel}</span>
        </Link>
      ) : null}
    </div>
  );
}
