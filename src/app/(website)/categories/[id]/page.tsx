import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Lock,
  MessageSquare,
  Wrench,
  Home,
} from "lucide-react";
import {
  getCategoryById,
  getServicesByCategory,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { categoryPhoto, rotatingCategoryPhoto, stock } from "@/lib/stock-photos";

export const revalidate = 3600; // 1 hour ISR

interface CategoryServicesPageProps {
  params: Promise<{ id: string }>;
}

const PROMISES = [
  { icon: BadgeCheck, title: "Verified pros", text: "ID-checked professionals with real reviews." },
  { icon: MessageSquare, title: "Free custom quotes", text: "Describe the job and compare offers." },
  { icon: Lock, title: "Escrow protection", text: "Pay only when you approve the work." },
];

export default async function CategoryServicesPage({
  params,
}: CategoryServicesPageProps) {
  const { id } = await params;
  const [categoryRes, servicesRes] = await Promise.all([
    getCategoryById(id),
    getServicesByCategory(id),
  ]);

  const category = categoryRes?.data;
  if (!category) {
    notFound();
  }

  const services = servicesRes?.data || [];
  const heroImage =
    (category.image ? getImageUrl(category.image) : null) ||
    categoryPhoto(category.name, category.slug) ||
    stock.constructionTeam;
  const browseHref = `/browse-pros?category=${category.slug || category._id}`;

  return (
    <div className="min-h-screen bg-white pt-18">
      {/* 1. Photo hero */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-copy">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-title">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/services" className="hover:text-title">Services</Link>
          <span className="text-slate-300">/</span>
          <span className="truncate text-title">{category.name}</span>
        </nav>

        <div className="relative isolate mt-5 overflow-hidden rounded-3xl bg-[#2A0A12]">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#2A0A12] via-[#2A0A12]/80 to-[#2A0A12]/20" />
          <div className="max-w-2xl px-6 py-14 sm:px-12 sm:py-20">
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-white! sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
              {category.description ||
                `Explore verified ${category.name.toLowerCase()} specialists. Compare custom quotes, check verified ratings, and hire with 100% escrow protection.`}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={browseHref}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Browse {category.name} pros <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-white/85">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                100% escrow protection
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold text-title sm:text-4xl">
              Explore {category.name}
            </h2>
            <p className="mt-2 text-base text-copy">
              Pick a service to see verified pros and request quotes.
            </p>
          </div>
          {services.length > 0 ? (
            <span className="rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-semibold text-title">
              {services.length} {services.length === 1 ? "service" : "services"}
            </span>
          ) : null}
        </div>

        {services.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-slate-50 px-6 py-16 text-center ring-1 ring-slate-200">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-slate-200">
              <Wrench className="h-8 w-8" strokeWidth={1.6} />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold text-title">
              No individual services listed yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-[15px] text-copy">
              You can still browse {category.name} professionals and send them a direct quote request.
            </p>
            <Link
              href={browseHref}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Browse all {category.name} pros <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {services.map((service, index) => {
              const serviceImg =
                (service.image ? getImageUrl(service.image) : null) ||
                rotatingCategoryPhoto(index, service.name, category.name);

              return (
                <Link key={service._id} href={`/services/${service._id}/pros`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                    {serviceImg ? (
                      <Image
                        src={serviceImg}
                        alt={service.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-linear-to-br from-[#4A0D1E] to-primary">
                        <Wrench className="h-10 w-10 text-white/80" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-title transition-colors group-hover:text-primary sm:text-[17px]">
                    {service.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-copy">
                    {service.description ||
                      `Verified ${service.name.toLowerCase()} pros, ready to quote.`}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Why hire here */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {PROMISES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-title text-title">
                <Icon className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div>
                <p className="font-semibold text-title">{title}</p>
                <p className="mt-1 text-[15px] text-copy">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#4A0D1E] px-6 py-10 sm:flex-row sm:items-center sm:px-12">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white! sm:text-3xl">
              Not sure which service you need?
            </h2>
            <p className="mt-2 text-white/70">Post your job for free and let {category.name.toLowerCase()} pros come to you.</p>
          </div>
          <Link
            href="/account/post-job"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            Post a job <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
