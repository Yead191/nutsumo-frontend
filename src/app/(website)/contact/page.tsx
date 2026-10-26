"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextField } from "@/components/ui/field";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";

const socialLinks = [
  {
    href: "https://www.facebook.com/localhomefix",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.953.93-1.953 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/localhomefix",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/localhomefix",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/localhomefix",
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <>
      <PageBanner
        eyebrow="Contact"
        title="Contact Us"
        description="Have questions or need assistance? Reach out to our Austin support team anytime."
        image={photos.banners.contact}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      <section className="bg-surface/50 py-12 md:py-20 border-b border-line/60">
        <div className="container-site grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ========================================================= */}
          {/* LEFT COLUMN: GET IN TOUCH CARD                            */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-[28px] border border-line/80 bg-white p-6 sm:p-8 md:p-9 shadow-xs">
            <div className="space-y-6 sm:space-y-7">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-title tracking-tight">
                  Get in Touch
                </h2>
                <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-muted">
                  Have questions or need help with a request? Reach out to us directly.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href="mailto:admin@localhomefix.com"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-line/70 bg-white p-4 transition-all duration-200 hover:border-primary/60 hover:shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100 transition-colors group-hover:bg-primary group-hover:text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Email
                      </h3>
                      <p className="text-sm font-semibold text-title group-hover:text-primary transition-colors">
                        admin@localhomefix.com
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </a>

                <a
                  href="tel:5125550140"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-line/70 bg-white p-4 transition-all duration-200 hover:border-primary/60 hover:shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100 transition-colors group-hover:bg-primary group-hover:text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Phone
                      </h3>
                      <p className="text-sm font-semibold text-title group-hover:text-primary transition-colors">
                        (512) 555-0140
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </a>

                <div className="group flex items-center gap-3.5 rounded-2xl border border-line/70 bg-white p-4 transition-all duration-200 hover:border-primary/60 hover:shadow-xs">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100 transition-colors group-hover:bg-primary group-hover:text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Service Area
                    </h3>
                    <p className="text-sm font-semibold text-title group-hover:text-primary transition-colors">
                      Austin, TX &amp; surrounding areas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-line/60 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Follow us</p>
              <div className="mt-3 flex items-center gap-2.5">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-line/80 bg-white text-muted shadow-2xs transition-all hover:border-primary/50 hover:bg-smoke hover:text-primary hover:scale-105"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: SEND MESSAGE FORM                           */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-[28px] border border-line/80 bg-white p-6 sm:p-8 md:p-9 shadow-xs space-y-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-title tracking-tight">
                Send a Message
              </h2>
              <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-muted">
                Drop us a note below and a representative will reply to your email promptly.
              </p>
            </div>

            {sent ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-7 text-center space-y-3">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-title">Message Successfully Sent</h3>
                <p className="text-sm text-copy/90 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. We have received your inquiry and will follow up shortly at your provided email.
                </p>
                <div className="pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSent(false)} className="rounded-full text-xs">
                    Send another message
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={submit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <TextField required name="name" placeholder="Luis Ortega" />
                  </Field>
                  <Field label="Email Address">
                    <TextField required name="email" type="email" placeholder="you@example.com" />
                  </Field>
                </div>

                <Field label="Subject">
                  <TextField required name="subject" placeholder="Contractor verification, quote question, etc." />
                </Field>

                <Field label="Your Message">
                  <TextArea required name="message" placeholder="Provide as much detail as possible..." className="min-h-32" />
                </Field>

                <Button type="submit" size="lg" className="w-full justify-center rounded-full shadow-xs">
                  Send Message ↗
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
