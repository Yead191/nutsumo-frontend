"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Edit3,
  Trash2,
  Tag,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import type { PortfolioItem, PortfolioCategory } from "../types";

interface PortfolioCardProps {
  item: PortfolioItem;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (item: PortfolioItem) => void;
}

export function PortfolioCard({
  item,
  onEdit,
  onDelete,
}: PortfolioCardProps) {
  const images = item.images || [];
  const categoryName =
    typeof item.category === "object" && item.category !== null
      ? (item.category as PortfolioCategory).name
      : "General Craft";

  const formattedDate = item.completedAt
    ? new Date(item.completedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  const detailUrl = `/pro/portfolio/${item._id}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Multi-Image Display (Min 2 images, 3 if available) */}
      <Link href={detailUrl} className="block relative bg-slate-100 overflow-hidden">
        {images.length === 0 ? (
          <div className="flex h-60 w-full items-center justify-center text-muted bg-slate-100">
            <Layers className="h-10 w-10 opacity-30" />
          </div>
        ) : images.length === 1 ? (
          /* Single Image fallback */
          <div className="relative h-60 sm:h-64 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(images[0].url) || images[0].url}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {images[0].type !== "work" && (
              <span
                className={`absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm ${
                  images[0].type === "before" ? "bg-rose-600" : "bg-emerald-600"
                }`}
              >
                {images[0].type === "before" ? "Before" : "After"}
              </span>
            )}
          </div>
        ) : images.length === 2 ? (
          /* Min 2 images layout (Side-by-side split) */
          <div className="grid grid-cols-2 gap-1 h-60 sm:h-64 w-full bg-slate-900">
            {images.slice(0, 2).map((img, i) => (
              <div key={i} className="relative h-full w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(img.url) || img.url}
                  alt={`${item.title} ${img.type}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm capitalize ${
                    img.type === "before"
                      ? "bg-rose-600"
                      : img.type === "after"
                        ? "bg-emerald-600"
                        : "bg-blue-600"
                  }`}
                >
                  {img.type}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* 3 Images layout (Shows 3 distinct shots side-by-side with +more count) */
          <div className="grid grid-cols-3 gap-1 h-60 sm:h-64 w-full bg-slate-900">
            {images.slice(0, 3).map((img, i) => (
              <div key={i} className="relative h-full w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(img.url) || img.url}
                  alt={`${item.title} ${img.type}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute bottom-3 left-2.5 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm capitalize ${
                    img.type === "before"
                      ? "bg-rose-600"
                      : img.type === "after"
                        ? "bg-emerald-600"
                        : "bg-blue-600"
                  }`}
                >
                  {img.type}
                </span>

                {/* If more than 3 images exist, overlay on 3rd tile */}
                {i === 2 && images.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center text-white font-bold text-xs">
                    +{images.length - 3} More
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-sm border border-white/20">
            <Layers className="h-3 w-3" />
            {images.length} {images.length === 1 ? "Photo" : "Photos"}
          </span>

          {item.isPublished ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              <CheckCircle2 className="h-3 w-3" />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              <Clock className="h-3 w-3" />
              Draft
            </span>
          )}
        </div>
      </Link>

      {/* Project Details */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 space-y-3">
        {/* Category & Completed Date */}
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            <Tag className="h-3.5 w-3.5 shrink-0" />
            {categoryName}
          </span>

          {formattedDate && (
            <span className="inline-flex items-center gap-1 font-medium">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-muted" />
              {formattedDate}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={detailUrl} className="block group/title">
          <h3 className="font-display text-lg font-bold text-title line-clamp-1 group-hover/title:text-primary transition-colors">
            {item.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted line-clamp-2 leading-relaxed flex-1">
          {item.description || "No project description provided."}
        </p>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-3 border-t border-line">
          <Link
            href={detailUrl}
            className="text-xs font-bold text-primary hover:text-primary-hover inline-flex items-center gap-1 transition"
          >
            View Project Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="p-2 rounded-xl text-muted hover:text-title hover:bg-slate-100 transition"
              title="Edit project"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="p-2 rounded-xl text-muted hover:text-rose-600 hover:bg-rose-50 transition"
              title="Delete project"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
