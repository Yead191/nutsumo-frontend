import { Star, ShieldCheck, Quote } from "lucide-react";
import Image from "next/image";
import type { ITestimonialItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";

interface HomeTestimonialsSectionProps {
  testimonials?: ITestimonialItem[];
}

export function HomeTestimonialsSection({
  testimonials = [],
}: HomeTestimonialsSectionProps) {
  const fallbackStories: ITestimonialItem[] = [
    {
      _id: "t1",
      name: "Kwame Mensah",
      role: "Homeowner in Accra",
      comment:
        "The escrow system gave me total peace of mind. The electrician knew exactly what needed to be done, completed the rewiring promptly, and I only released the payment once we tested every single outlet. Absolutely flawless experience!",
      rating: 5,
    },
    {
      _id: "t2",
      name: "Esi Boateng",
      role: "Property Manager",
      comment:
        "Finding reliable plumbers used to take days of calling around. On Nutsumo, I submitted a custom quote request, got a transparent proposal within 30 minutes, and the pipe leak was repaired the very next morning. No hidden fees!",
      rating: 5,
    },
    {
      _id: "t3",
      name: "Samuel Osei",
      role: "Homeowner",
      comment:
        "What I love most is the 20% statutory tax breakdown. Everything was upfront — VAT, NHIL, and GETFund were clearly itemized on the proposal. The craftsman was professional, tidy, and did an outstanding tiling job.",
      rating: 5,
    },
  ];

  const items = testimonials.length > 0 ? testimonials : fallbackStories;

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block font-display">
            Customer Stories
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-title tracking-tight">
            Loved by Homeowners &amp; Property Owners
          </h2>
          <p className="text-sm sm:text-base text-copy font-sans">
            Real experiences from clients who hired verified trade pros with
            Nutsumo&apos;s escrow protection guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item, idx) => {
            const avatarUrl = item.image ? getImageUrl(item.image) : null;
            const rating = item.rating || 5;

            return (
              <div
                key={item._id || idx}
                className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-slate-200" />
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-copy italic leading-relaxed font-sans">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>

                {/* Client Profile */}
                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-full overflow-hidden bg-primary/10 border border-slate-200 shrink-0">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-primary font-bold text-sm font-display">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-display text-sm font-bold text-title">
                        {item.name}
                      </h4>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-[11px] text-muted">{item.role || "Verified Client"}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
