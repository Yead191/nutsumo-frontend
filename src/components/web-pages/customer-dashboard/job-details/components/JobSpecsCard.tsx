"use client";

import { useState } from "react";
import Image from "next/image";
import { Layers, Image as ImageIcon, X, Maximize2 } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IJobItem } from "@/helpers/next-fetch/apiActions/jobActions";

interface JobSpecsCardProps {
  job: IJobItem;
}

export function JobSpecsCard({ job }: JobSpecsCardProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const categoryName =
    typeof job.category === "object" && job.category?.name
      ? job.category.name
      : "";
  const serviceName =
    typeof job.service === "object" && job.service?.name
      ? job.service.name
      : job.customServiceName || "";

  const images = Array.isArray(job.images) ? job.images : [];

  return (
    <div className="rounded-3xl border border-line/80 bg-white p-6 shadow-2xs space-y-6">
      {/* 1. Category & Service Taxonomy */}
      <div>
        <h3 className="font-display text-sm font-bold text-title mb-2">
          Service Category
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {categoryName && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-smoke px-3.5 py-1.5 text-xs font-bold text-title border border-line">
              <Layers className="h-3.5 w-3.5 text-[#FE375D]" />
              <span>{categoryName}</span>
            </span>
          )}
          {serviceName && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200">
              <span>{serviceName}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Description */}
      <div>
        <h3 className="font-display text-sm font-bold text-title mb-2">
          Project Description
        </h3>
        <div className="rounded-2xl bg-smoke/60 p-4 border border-line/60">
          <p className="text-xs sm:text-sm text-title/90 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>
      </div>

      {/* 3. Photo Gallery */}
      {images.length > 0 && (
        <div>
          <h3 className="font-display text-sm font-bold text-title mb-3 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-[#FE375D]" />
            <span>Attached Photos ({images.length})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => {
              const fullUrl = getImageUrl(img);
              if (!fullUrl) return null;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(fullUrl)}
                  className="group relative h-28 sm:h-32 rounded-2xl overflow-hidden border border-line bg-smoke shadow-2xs cursor-pointer hover:border-[#FE375D] transition-colors"
                >
                  <Image
                    src={fullUrl}
                    alt={`Job attachment ${idx + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="h-5 w-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          />
          <div className="relative max-w-3xl max-h-[85vh] w-full z-10 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white hover:bg-white/40 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-2xl overflow-hidden">
              <Image
                src={selectedPhoto}
                alt="Enlarged photo"
                fill
                className="object-contain"
                sizes="1000px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
