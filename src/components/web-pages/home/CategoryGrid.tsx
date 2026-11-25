import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
  Zap,
  Code,
  Sparkles,
  TreePine,
  Layers,
  Home,
  Tv,
  Hammer,
  Paintbrush,
  Wind,
  Droplets,
  ArrowRight,
  Briefcase,
  ChefHat,
  Car,
  Baby,
  Shield,
  Laptop,
  Camera,
} from "lucide-react";
import type { ICategoryItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";

interface CategoryGridProps {
  categories: ICategoryItem[];
}

function getCategoryIcon(name: string = "", slug: string = "") {
  const query = `${name} ${slug}`.toLowerCase();
  if (query.includes("chef") || query.includes("cook") || query.includes("cater"))
    return ChefHat;
  if (query.includes("driv") || query.includes("chauffeur") || query.includes("deliver"))
    return Car;
  if (query.includes("nann") || query.includes("child") || query.includes("babysit") || query.includes("care"))
    return Baby;
  if (query.includes("secur") || query.includes("guard")) return Shield;
  if (query.includes("office") || query.includes("admin") || query.includes("account") || query.includes("secretar"))
    return Laptop;
  if (query.includes("photo") || query.includes("video") || query.includes("design") || query.includes("creative") || query.includes("music"))
    return Camera;
  if (query.includes("plumb") || query.includes("pipe")) return Droplets;
  if (query.includes("electr") || query.includes("wire")) return Zap;
  if (query.includes("clean") || query.includes("house")) return Sparkles;
  if (query.includes("paint")) return Paintbrush;
  if (query.includes("carpent") || query.includes("wood")) return Hammer;
  if (query.includes("roof")) return Home;
  if (query.includes("appliance") || query.includes("tv")) return Tv;
  if (query.includes("hvac") || query.includes("air") || query.includes("heat"))
    return Wind;
  if (query.includes("landscape") || query.includes("garden")) return TreePine;
  if (query.includes("tile") || query.includes("mason")) return Layers;
  if (query.includes("code") || query.includes("soft") || query.includes("dev"))
    return Code;
  if (query.includes("repair") || query.includes("mechanic") || query.includes("technic"))
    return Wrench;
  return Briefcase;
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const activeCategories = (categories || []).filter(
    (c) => c.isActive !== false,
  );

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2 font-display">
              Browse Skills & Professions
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-title tracking-tight">
              Explore Workers by Category
            </h2>
            <p className="mt-2 text-sm sm:text-base text-copy max-w-2xl font-sans">
              From tradespeople and technicians to chefs, drivers, nannies, security
              personnel, office and creative professionals — find verified
              people for every kind of work.
            </p>
          </div>

          <Link
            href="/browse-pros"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover hover:underline transition-colors shrink-0 group"
          >
            <span>View All Categories &amp; Pros</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeCategories.map((cat) => {
            const IconComponent = getCategoryIcon(cat.name, cat.slug);
            const imageUrl = cat.image ? getImageUrl(cat.image) : null;

            return (
              <Link
                key={cat._id}
                href={`/browse-pros?category=${cat._id}`}
                className="group relative rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Icon / Image Well */}
                  <div className="mb-4 relative h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden group-hover:bg-primary/10 transition-colors">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <IconComponent className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-base sm:text-lg font-bold text-title group-hover:text-primary transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
                    {cat.description ||
                      "Verified skilled workers available for hire."}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Explore Pros</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
