import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Star,
  ExternalLink,
} from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IBookingUser } from "@/helpers/next-fetch/apiActions/bookingActions";

interface HiredArtisanCardProps {
  artisan: IBookingUser;
}

export function HiredArtisanCard({ artisan }: HiredArtisanCardProps) {
  const avatarUrl = artisan?.image ? getImageUrl(artisan.image) : null;

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <h3 className="font-display text-sm font-bold text-title">
          Hired Service Professional
        </h3>
        {artisan?.verified && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            <span>ID Verified</span>
          </span>
        )}
      </div>

      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line bg-smoke shadow-2xs">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={artisan?.name || "Artisan"}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-slate-100 font-bold text-lg text-title">
              {artisan?.name?.charAt(0) || "P"}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-base font-bold text-title truncate">
              {artisan?.name}
            </h4>
          </div>

          {artisan?.location && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
              <MapPin className="h-3.5 w-3.5 text-[#FE375D] shrink-0" />
              <span>{artisan.location}</span>
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {artisan?.phone && (
              <span className="text-muted">
                Phone: <strong className="text-title">{artisan.phone}</strong>
              </span>
            )}
            {artisan?.email && (
              <span className="text-muted">
                Email: <strong className="text-title">{artisan.email}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {artisan?.phone ? (
          <a
            href={`tel:${artisan.phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white hover:border-emerald-500 hover:text-emerald-700 py-2.5 text-xs font-semibold text-title shadow-2xs transition-colors"
          >
            <Phone className="h-4 w-4 text-emerald-600" />
            <span>Direct Call</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-slate-50 py-2.5 text-xs font-semibold text-muted opacity-50"
          >
            <Phone className="h-4 w-4" />
            <span>No Phone</span>
          </button>
        )}

        <Link
          href={`/account/messages?recipient=${artisan?._id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FE375D] hover:bg-[#e0284e] text-white py-2.5 text-xs font-semibold shadow-xs transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat on Nutsumo</span>
        </Link>
      </div>
    </div>
  );
}
