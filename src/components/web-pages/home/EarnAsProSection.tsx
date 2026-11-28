import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, Wallet, CalendarCheck } from "lucide-react";
import { stock } from "@/lib/stock-photos";

const PERKS = [
  { icon: BriefcaseBusiness, title: "Steady job leads", text: "Clients post jobs every day. Quote on the ones that fit you." },
  { icon: CalendarCheck, title: "Your rates, your schedule", text: "Set your prices, service areas and availability." },
  { icon: Wallet, title: "Guaranteed payment", text: "Money is secured in escrow before work begins." },
];

const FACES = [
  { src: stock.carpenter, className: "col-span-2 row-span-2" },
  { src: stock.portraitWoman, className: "" },
  { src: stock.chef, className: "" },
  { src: stock.portraitManLaugh, className: "" },
  { src: stock.cleaner, className: "" },
];

/** Recruitment section for skilled workers. */
export function EarnAsProSection() {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 lg:order-1 grid grid-cols-3 grid-rows-[repeat(3,minmax(0,1fr))] gap-3 sm:gap-4 aspect-square">
          {FACES.map((face, index) => (
            <div key={face.src} className={`relative overflow-hidden rounded-2xl ${face.className} ${index === 4 ? "col-span-2" : ""}`}>
              <Image src={face.src} alt="" fill sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover" />
            </div>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">For skilled workers</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-[44px] lg:leading-[1.1] font-semibold text-title">
            Turn your skills into steady income
          </h2>
          <p className="mt-4 text-base sm:text-lg text-copy max-w-lg">
            Electricians, chefs, drivers, developers, cleaners, designers: if
            you&apos;re good at what you do, clients are looking for you.
          </p>

          <ul className="mt-8 space-y-6">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-title">{title}</p>
                  <p className="mt-0.5 text-[15px] text-copy">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/pro-register"
            className="mt-10 inline-flex items-center gap-2 rounded-lg bg-title px-6 py-3 text-base font-semibold text-white! hover:bg-black transition-colors"
          >
            Join as a pro
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
