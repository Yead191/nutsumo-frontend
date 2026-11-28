import Link from "next/link";
import { MapPin } from "lucide-react";

const CITIES = [
  "Accra",
  "Kumasi",
  "Tema",
  "Takoradi",
  "Cape Coast",
  "Tamale",
  "Koforidua",
  "Ho",
  "Sunyani",
  "Kasoa",
  "Obuasi",
  "Madina",
];

/** Slim "available across Ghana" band; each city links to a location search. */
export function CitiesMarquee() {
  // Rendered twice so the -50% marquee loop is seamless.
  const loop = [...CITIES, ...CITIES];

  return (
    <section aria-label="Cities we serve" className="bg-white pt-10 sm:pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:gap-8">
          <p className="shrink-0 text-sm font-semibold text-copy">
            Hiring verified pros across Ghana
          </p>
          <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee gap-3">
              {loop.map((city, index) => (
                <Link
                  key={`${city}-${index}`}
                  href={`/browse-pros?location=${encodeURIComponent(city)}`}
                  tabIndex={index >= CITIES.length ? -1 : undefined}
                  aria-hidden={index >= CITIES.length ? true : undefined}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-title shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition hover:text-primary"
                >
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
