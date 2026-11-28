"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { PageBanner } from "@/components/layout/page-banner";
import { stock } from "@/lib/stock-photos";

const CHANNELS = [
  {
    icon: Mail,
    title: "Email support",
    value: "support@nutsumo.com",
    href: "mailto:support@nutsumo.com",
    note: "Average response time: < 2 hours",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: ShieldCheck,
    title: "Escrow dispute desk",
    value: "disputes@nutsumo.com",
    href: "mailto:disputes@nutsumo.com",
    note: "Fast resolution for escrow & milestone disputes",
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Phone,
    title: "Telephone / WhatsApp",
    value: "+233 (0) 55 000 0000",
    href: undefined,
    note: "Monday to Saturday: 8:00 AM – 6:00 PM GMT",
    tone: "bg-amber-50 text-amber-600",
  },
  {
    icon: MapPin,
    title: "Accra headquarters",
    value: "Airport Residential Area, Accra, Ghana",
    href: undefined,
    note: "Our support and dispute resolution team",
    tone: "bg-indigo-50 text-indigo-600",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Support Inquiry");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Message received! Our Accra support desk will reply within 2 hours.");
    }, 800);
  };

  return (
    <div className="bg-white min-h-screen pb-20 sm:pb-28">
      {/* 1. HERO BANNER */}
      <PageBanner
        eyebrow="24/7 support & dispute desk"
        title="We’re here to help you succeed"
        description="Questions about an escrow payment, professional verification, or a job in progress? Our Accra team is ready to help."
        image={stock.womenMeeting}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/* 2. CHANNEL CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ icon: Icon, title, value, href, note, tone }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)]"
            >
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-sm font-semibold text-copy">{title}</p>
              {href ? (
                <a href={href} className="mt-1 block break-words font-display text-lg font-semibold text-title hover:text-primary">
                  {value}
                </a>
              ) : (
                <p className="mt-1 font-display text-lg font-semibold text-title">{value}</p>
              )}
              <p className="mt-2 text-sm text-copy">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PHOTO + FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 relative min-h-[360px] overflow-hidden rounded-3xl">
            <Image
              src={stock.consultation}
              alt="A Nutsumo support officer helping a client"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#2A0A12]/90 via-[#2A0A12]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="font-display text-2xl font-semibold leading-snug text-white!">
                Real people in Accra, ready to help with any job, payment or dispute.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-white/85">
                {["Escrow & payment questions", "Pro verification & applications", "Business & partnership requests"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] space-y-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-title">
                  Send us a message
                </h2>
                <p className="text-sm sm:text-base text-copy mt-2 leading-relaxed">
                  Fill out the form below and an agent will contact you promptly.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center space-y-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-emerald-900">
                    Message Successfully Sent!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-sm mx-auto">
                    Thank you for reaching out. A Nutsumo customer care officer will get back to you via email or phone within 2 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    <span>Send Another Message</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-title">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Kwame Mensah"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-title placeholder:text-slate-400 focus:border-title focus:outline-none focus:ring-4 focus:ring-slate-100 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-title">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="kwame@example.com"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-title placeholder:text-slate-400 focus:border-title focus:outline-none focus:ring-4 focus:ring-slate-100 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-title">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+233 24 000 0000"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-title placeholder:text-slate-400 focus:border-title focus:outline-none focus:ring-4 focus:ring-slate-100 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-title">
                        Inquiry Topic *
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-title placeholder:text-slate-400 focus:border-title focus:outline-none focus:ring-4 focus:ring-slate-100 transition"
                      >
                        <option value="General Support Inquiry">General Support Inquiry</option>
                        <option value="Escrow & Payment Question">Escrow & Payment Question</option>
                        <option value="Professional Verification & Application">Professional Verification & Application</option>
                        <option value="Dispute Resolution Desk">Dispute Resolution Desk</option>
                        <option value="Partnership / Corporate Request">Partnership / Corporate Request</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-title">
                      Message Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please describe how we can assist you..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-title placeholder:text-slate-400 focus:border-title focus:outline-none focus:ring-4 focus:ring-slate-100 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white py-4 text-base font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUICK ANSWERS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="flex flex-col gap-5 rounded-3xl bg-slate-50 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-primary shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-title">Looking for a quick answer?</p>
              <p className="text-sm text-copy">Most questions about escrow, fees and verification are answered in our FAQ.</p>
            </div>
          </div>
          <Link
            href="/faq"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-title px-5 py-3 text-sm font-semibold text-white! hover:bg-black transition-colors"
          >
            Visit the help centre <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
