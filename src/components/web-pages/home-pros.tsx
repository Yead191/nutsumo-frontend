"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ProCard } from "@/components/shared/pro-card";
import { professionals } from "@/Mockdata";
import { cn } from "@/lib/cn";

export function HomePros() {
  const list = professionals.filter((pro) => pro.clearance === "cleared");
  const scroller = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setHasOverflow(maxScroll > 10);
    const itemWidth = 310; // 290px card + 20px gap
    const index = Math.round(el.scrollLeft / itemWidth);
    setActiveIndex(Math.max(0, Math.min(index, list.length - 1)));
  }, [list.length]);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  function scrollBy(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    el.style.scrollBehavior = "smooth";
    const maxScroll = el.scrollWidth - el.clientWidth;
    const step = el.clientWidth > 960 ? 310 * 2 : 310;

    // Smooth wrap-around so clicking always yields a responsive action
    if (dir === 1 && el.scrollLeft >= maxScroll - 15) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir === -1 && el.scrollLeft <= 15) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * step, behavior: "smooth" });
    }
  }

  function scrollToIndex(index: number) {
    const el = scroller.current;
    if (!el) return;
    el.style.scrollBehavior = "smooth";
    el.scrollTo({ left: index * 310, behavior: "smooth" });
  }

  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-2">
          <SectionHeading
            align="left"
            eyebrow="Popular Near You"
            title="Top-rated pros ready to help"
            description="A curated showcase of background-checked specialists in your area. Compare neighbor ratings, view past work, or explore the full directory."
          />

          {/* Ergonomic Header Navigation Cluster: Zero Card Overlap */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-end">
            <button
              type="button"
              aria-label="Previous professionals"
              title="Previous"
              onClick={() => scrollBy(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line/90 bg-white text-title shadow-xs transition-all duration-200 hover:scale-105 hover:bg-white hover:text-primary hover:border-primary/40 hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              aria-label="Next professionals"
              title="Next"
              onClick={() => scrollBy(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line/90 bg-white text-title shadow-xs transition-all duration-200 hover:scale-105 hover:bg-white hover:text-primary hover:border-primary/40 hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <div className="relative mt-8 sm:mt-10">
          {/* Scrollable track with touch & wheel support */}
          <div
            ref={scroller}
            onScroll={updateScrollState}
            className="-mx-1 flex gap-5 overflow-x-auto scroll-smooth px-1 pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {list.map((pro) => (
              <div
                key={pro.id}
                className="shrink-0 flex h-full"
              >
                <ProCard pro={pro} className="w-[270px] sm:w-[290px]" />
              </div>
            ))}
          </div>

          {/* Slide Indicator Dots */}
          {hasOverflow && (
            <div className="mt-6 flex items-center justify-center gap-1.5">
              {list.map((pro, idx) => (
                <button
                  key={pro.id}
                  type="button"
                  aria-label={`Go to professional ${idx + 1}`}
                  onClick={() => scrollToIndex(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    activeIndex === idx
                      ? "w-7 bg-primary"
                      : "w-2 bg-line hover:bg-title/30",
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 sm:mt-14 text-center">
          <Button href="/browse-pros" variant="ghost">
            Browse all pros ↗
          </Button>
        </div>
      </div>
    </section>
  );
}
