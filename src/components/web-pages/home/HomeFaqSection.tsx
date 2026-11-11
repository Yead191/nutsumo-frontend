"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { IFaqItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";

interface HomeFaqSectionProps {
  faqs?: IFaqItem[];
}

export function HomeFaqSection({ faqs = [] }: HomeFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const fallbackFaqs = [
    {
      _id: "faq-1",
      question: "How does Nutsumo Escrow protect my money?",
      answer:
        "When you accept a quotation, your payment is deposited into secure platform escrow via Stripe. The artisan begins working immediately knowing the funds are guaranteed. Crucially, the money is never released to the artisan until you inspect the delivered work and authorize the release.",
    },
    {
      _id: "faq-2",
      question: "What are the 20% statutory deductions shown on quotations?",
      answer:
        "Nutsumo fully complies with Ghana's statutory tax and revenue laws. Every quote shows an exact transparent breakdown of the 20% total deductions: Value Added Tax (VAT 15%), National Health Insurance Levy (NHIL 2.5%), and Ghana Education Trust Fund Levy (GETFund 2.5%). Homeowners pay only the agreed contract price with zero hidden markups, and artisans receive their 80% net take-home earnings directly.",
    },
    {
      _id: "faq-3",
      question: "How do I request a custom quotation from an artisan?",
      answer:
        "You can browse categories or search for specific trade specialists. Once you find an artisan with the skills and reviews you need, simply click 'Request Custom Quote' on their profile or proposal card, describe your project, upload any photos of the issue, and they will send you a tailored proposal with proposed pricing and estimated duration.",
    },
    {
      _id: "faq-4",
      question: "What happens if the delivered work needs revisions?",
      answer:
        "When an artisan marks a job as delivered, you have the opportunity to inspect the work. If anything does not meet your expectations, you can click 'Request Revision' with notes and photos. Escrow remains held until the issues are rectified. If a mutual agreement cannot be reached, our 24/7 Resolution Desk steps in to review evidence and resolve the dispute.",
    },
    {
      _id: "faq-5",
      question: "Are all trade professionals identity-verified?",
      answer:
        "Yes. Craftsmen on Nutsumo complete identity and credentials verification (National ID / Ghana Card, verified phone number, trade experience, and portfolio verification) before they can take client bookings.",
    },
  ];

  const items = faqs.length > 0 ? faqs : fallbackFaqs;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block font-display">
            Got Questions?
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-title tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-copy font-sans">
            Everything you need to know about escrow protection, hiring pros,
            and statutory tax transparency.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={item._id || idx}
                className="rounded-2xl border border-slate-200 bg-white transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <span className="font-display text-sm sm:text-base font-bold text-title">
                    {item.question}
                  </span>
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-primary/10 text-primary" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-slate-100 text-xs sm:text-sm text-copy leading-relaxed font-sans animate-in fade-in duration-200">
                    <p className="pt-3">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
