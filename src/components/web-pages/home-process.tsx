import { ArrowRight, ClipboardPen, Handshake, Receipt, Scale } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    step: "01",
    title: "Post your repair request",
    text: "Share what needs fixing, select your preferred schedule, and add a few photos so contractors can scope the work accurately.",
    icon: ClipboardPen,
  },
  {
    step: "02",
    title: "Receive itemized quotes",
    text: "Vetted local specialists review your details and send clear price breakdowns with labor, parts, and estimated timelines.",
    icon: Receipt,
  },
  {
    step: "03",
    title: "Compare & select your pro",
    text: "Review estimates side-by-side, read verified neighbor reviews, and chat directly with contractors before making a decision.",
    icon: Scale,
  },
  {
    step: "04",
    title: "Hire & pay on completion",
    text: "Confirm your appointment, inspect the completed repair in person, and pay your contractor directly with zero middleman markups.",
    icon: Handshake,
  },
];

export function HomeProcess() {
  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="flex flex-col items-center text-center">
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title="How to get your repair done right"
            description="Post your project for free, compare transparent quotes from vetted local specialists, and pay directly only when the work is complete."
          />
        </div>

        <div className="mt-14 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between rounded-[24px] border border-line bg-white p-7 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-2xl font-bold tracking-tight text-title/25 group-hover:text-primary/30 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-display text-[19px] sm:text-[20px] font-semibold tracking-tight leading-snug text-title">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 font-sans text-sm leading-[24px] text-[#757575]">
                      {item.text}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-line/60 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Step {index + 1} of 4</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}