"use client";

import { useEffect, useState, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
} from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import { cn } from "@/lib/cn";

interface ImageLightboxModalProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function ImageLightboxModal({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}: ImageLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync index when modal opens with a new initialIndex
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const totalImages = images.length;
  const currentImage = images[currentIndex];
  const resolvedUrl = currentImage ? getImageUrl(currentImage) || currentImage : "";

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (totalImages <= 1) return;
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    },
    [totalImages],
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (totalImages <= 1) return;
      setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    },
    [totalImages],
  );

  // Keyboard navigation & body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || totalImages === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/92 backdrop-blur-md animate-in fade-in duration-200 select-none p-3 sm:p-6"
      onClick={onClose}
    >
      {/* TOP CONTROLS BAR */}
      <div
        className="w-full flex items-center justify-between text-white z-20 px-2 py-1 max-w-7xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-white/80 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {totalImages}
          </span>
          {title && (
            <span className="text-xs sm:text-sm font-medium text-white/90 truncate max-w-[200px] sm:max-w-md hidden sm:inline">
              {title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {resolvedUrl && (
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              title="Open full resolution in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* CENTER MAIN IMAGE AREA WITH ARROWS */}
      <div
        className="relative flex-1 w-full flex items-center justify-center my-2 max-w-7xl mx-auto"
        onClick={onClose}
      >
        {/* PREV BUTTON */}
        {totalImages > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 hover:border-white/40 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Previous (Left arrow)"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>
        )}

        {/* IMAGE CONTAINER */}
        <div
          className="relative max-h-[75vh] max-w-[90vw] sm:max-w-[85vw] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={resolvedUrl}
            src={resolvedUrl}
            alt={title || `Photo ${currentIndex + 1}`}
            className="max-h-[75vh] max-w-[90vw] sm:max-w-[85vw] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
          />
        </div>

        {/* NEXT BUTTON */}
        {totalImages > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 hover:border-white/40 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Next (Right arrow)"
          >
            <ChevronRight className="h-6 w-6 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* BOTTOM THUMBNAILS STRIP */}
      {totalImages > 1 && (
        <div
          className="w-full max-w-3xl mx-auto z-20 pb-1"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 max-h-20 scrollbar-none">
            {images.map((img, idx) => {
              const thumbUrl = getImageUrl(img) || img;
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "relative h-12 w-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                    isSelected
                      ? "border-primary ring-2 ring-primary/60 scale-105 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-90",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

