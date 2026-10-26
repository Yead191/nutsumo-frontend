"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

export interface LegalSection {
  title: string;
  body: string;
  note?: string;
}

interface LegalSectionsProps {
  documentType?: "terms" | "privacy";
  effectiveDate?: string;
  version?: string;
  sections: LegalSection[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LegalSections({
  documentType = "terms",
  effectiveDate = "October 20, 2026",
  sections,
}: LegalSectionsProps) {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container-site">
        <div className="mx-auto max-w-5xl">
          {/* Top Minimal Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <nav className="flex items-center gap-7">
              <Link
                href="/terms"
                className={cn(
                  "relative pb-2 font-display text-[15px] transition-colors",
                  documentType === "terms"
                    ? "font-bold text-primary after:absolute after:-bottom-[17px] after:left-0 after:right-0 after:h-[2px] after:bg-primary"
                    : "font-medium text-muted hover:text-title"
                )}
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className={cn(
                  "relative pb-2 font-display text-[15px] transition-colors",
                  documentType === "privacy"
                    ? "font-bold text-primary after:absolute after:-bottom-[17px] after:left-0 after:right-0 after:h-[2px] after:bg-primary"
                    : "font-medium text-muted hover:text-title"
                )}
              >
                Privacy Policy
              </Link>
            </nav>

            <span className="font-sans text-xs text-muted">
              Last updated: {effectiveDate}
            </span>
          </div>

          {/* Mobile TOC Quick-Jumper */}
          <div className="lg:hidden mt-6 overflow-x-auto pb-2 scrollbar-none">
            <div className="inline-flex items-center gap-2 text-xs">
              <span className="text-muted font-medium shrink-0">On this page:</span>
              {sections.map((section, idx) => (
                <a
                  key={section.title}
                  href={`#${slugify(section.title)}`}
                  className="shrink-0 rounded-full border border-line bg-smoke px-3 py-1 font-medium text-title hover:border-primary hover:text-primary transition-colors"
                >
                  {idx + 1}. {section.title}
                </a>
              ))}
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Desktop Minimal Sticky TOC */}
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-28">
                <p className="font-display text-xs font-bold uppercase tracking-wider text-muted">
                  On this page
                </p>
                <nav className="mt-4 space-y-2 border-l-2 border-line/70 pl-3.5">
                  {sections.map((section, idx) => {
                    const slug = slugify(section.title);
                    return (
                      <a
                        key={section.title}
                        href={`#${slug}`}
                        className="block font-sans text-sm font-medium text-[#666] hover:text-primary transition-colors leading-snug py-0.5"
                      >
                        {idx + 1}. {section.title}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Document Content Flow */}
            <div className="lg:col-span-9">
              <div className="divide-y divide-line/70">
                {sections.map((section, idx) => {
                  const slug = slugify(section.title);
                  return (
                    <article
                      key={section.title}
                      id={slug}
                      className={cn("scroll-mt-24", idx === 0 ? "pb-10" : "py-10")}
                    >
                      <h2 className="font-display text-[20px] sm:text-[22px] font-bold tracking-tight text-title">
                        {idx + 1}. {section.title}
                      </h2>

                      <p className="mt-3.5 font-sans text-[15.5px] sm:text-[16px] leading-[1.8] text-[#444]">
                        {section.body}
                      </p>

                      {section.note && (
                        <div className="mt-4 rounded-r-lg border-l-2 border-primary/70 bg-smoke/80 px-4 py-3 font-sans text-sm leading-relaxed text-[#555]">
                          <span className="font-semibold text-title">Key takeaway: </span>
                          {section.note}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              {/* Minimal Understated Contact Note */}
              <div className="mt-12 border-t border-line pt-8 text-sm text-muted">
                <p>
                  Have questions regarding our {documentType === "terms" ? "Terms & Conditions" : "Privacy Policy"}?{" "}
                  <Link href="/contact" className="font-semibold text-primary hover:underline">
                    Contact our support team
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
