"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

export function SuccessVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    setPlaying(true);
  };

  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-title text-center">
          What success on Nutsumo looks like
        </h2>
        <p className="mt-3 text-center text-base sm:text-lg text-copy max-w-2xl mx-auto">
          Clients and businesses get work done faster  and verified pros grow
          their income with every five-star job.
        </p>

        <div className="relative mt-10 overflow-hidden rounded-2xl bg-black aspect-video shadow-xl">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/videos/hero.mp4"
            poster="/videos/hero-poster.jpg"
            preload="none"
            playsInline
            loop
            muted
            controls={playing}
          />
          {!playing && (
            <button
              type="button"
              onClick={start}
              aria-label="Play video"
              className="group absolute inset-0 grid place-items-center bg-black/30 cursor-pointer"
            >
              <span className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-full bg-white/90 shadow-2xl transition-transform group-hover:scale-105">
                <Play className="h-8 w-8 sm:h-10 sm:w-10 fill-primary text-primary translate-x-0.5" />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
