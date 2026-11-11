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
    <div className="bg-white min-h-screen pb-24">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>24/7 Dedicated Support & Dispute Desk</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-title tracking-tight max-w-3xl mx-auto">
            We’re Here to Help You Succeed
          </h1>

          <p className="text-base sm:text-lg text-copy leading-relaxed max-w-2xl mx-auto font-sans">
            Have questions about an escrow payment, artisan verification, or need assistance with a job? Contact our Accra team anytime.
          </p>
        </div>
      </section>

      {/* 2. CONTACT GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Channels & Office Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-title">
                  Direct Support Channels
                </h2>
                <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                  Reach our dedicated trust officers and dispute resolution team directly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-title block">Email Support</span>
                    <a
                      href="mailto:support@nutsumo.com"
                      className="text-xs sm:text-sm font-semibold text-primary hover:underline"
                    >
                      support@nutsumo.com
                    </a>
                    <span className="text-[11px] text-muted block mt-0.5">
                      Average response time: &lt; 2 hours
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-title block">Escrow Dispute Desk</span>
                    <a
                      href="mailto:disputes@nutsumo.com"
                      className="text-xs sm:text-sm font-semibold text-emerald-700 hover:underline"
                    >
                      disputes@nutsumo.com
                    </a>
                    <span className="text-[11px] text-muted block mt-0.5">
                      Fast resolution for escrow & milestone disputes
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-title block">Telephone / WhatsApp</span>
                    <span className="text-xs sm:text-sm font-semibold text-title">
                      +233 (0) 55 000 0000
                    </span>
                    <span className="text-[11px] text-muted block mt-0.5">
                      Monday to Saturday: 8:00 AM – 6:00 PM GMT
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-title block">Accra Headquarters</span>
                    <span className="text-xs sm:text-sm text-copy block">
                      Airport Residential Area, Accra, Ghana
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send a Message Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm space-y-6">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-title">
                  Send Us a Direct Message
                </h2>
                <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-title uppercase font-display">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Kwame Mensah"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm text-title focus:border-primary focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-title uppercase font-display">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="kwame@example.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm text-title focus:border-primary focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-title uppercase font-display">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+233 24 000 0000"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm text-title focus:border-primary focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-title uppercase font-display">
                        Inquiry Topic *
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm text-title focus:border-primary focus:bg-white focus:outline-none transition-colors"
                      >
                        <option value="General Support Inquiry">General Support Inquiry</option>
                        <option value="Escrow & Payment Question">Escrow & Payment Question</option>
                        <option value="Artisan Verification & Application">Artisan Verification & Application</option>
                        <option value="Dispute Resolution Desk">Dispute Resolution Desk</option>
                        <option value="Partnership / Corporate Request">Partnership / Corporate Request</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-title uppercase font-display">
                      Message Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please describe how we can assist you..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm text-title focus:border-primary focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary-hover text-white py-3.5 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Message to Support Desk</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
