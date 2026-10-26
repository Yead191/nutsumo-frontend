"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { AuthLinks } from "@/components/web-pages/auth-links";
import { PasswordField } from "@/components/ui/password-field";
import { categories } from "@/Mockdata";
import { loginAs } from "@/redux/slices/authSlice";
import { saveApplicationDraft, submitApplication } from "@/redux/slices/featuresSlice";
import { useAppDispatch } from "@/redux/hooks";

const steps = ["Account", "Business", "Service area", "Background check"];
type CheckStatus = "idle" | "running" | "clear";

type FormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  trade: string;
  bio: string;
  serviceZip: string;
  radius: string;
};

const empty: FormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  businessName: "",
  trade: "",
  bio: "",
  serviceZip: "",
  radius: "25",
};

export default function ProRegisterPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const dispatch = useAppDispatch();
  const router = useRouter();

  function patch(partial: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function runBackgroundCheck() {
    setError("");
    if (!consent) {
      setError("Consent is required to run the background check.");
      return;
    }
    setCheckStatus("running");
    window.setTimeout(() => setCheckStatus("clear"), 1600);
  }

  function next() {
    setError("");
    if (step < 3) {
      setStep((value) => value + 1);
      return;
    }
    if (checkStatus !== "clear") {
      setError("Run the background check to finish applying.");
      return;
    }
    dispatch(
      saveApplicationDraft({
        ...Object.fromEntries(
          Object.entries(form).map(([key, value]) => [key, String(value)]),
        ),
        savedAt: new Date().toISOString(),
        backgroundCheck: "clear",
      }),
    );
    dispatch(submitApplication());
    dispatch(
      loginAs({
        role: "pro",
        profile: {
          name: form.name.trim() || "Luis Ortega",
          email: form.email.trim() || "pro@localfix.com",
          phone: form.phone.trim() || "(512) 555-0144",
          zip: form.serviceZip.trim() || "78701",
          city: "Austin",
          state: "TX",
        },
      }),
    );
    router.push("/pro/application?applied=1");
  }

  return (
    <div>
      <h1 className="font-display text-[22px] sm:text-[24px] font-semibold leading-snug tracking-tight text-title">
        Join as a professional
      </h1>
      <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#666]">
        {step === 0 && "Create your professional account to connect directly with Austin homeowners."}
        {step === 1 && "Tell homeowners about your trade specialty and craftsmanship experience."}
        {step === 2 && "Set your local service territory and service coverage radius."}
        {step === 3 && "Last step: verify credentials and authorize a quick identity screening."}
      </p>

      <ol className="relative mt-6 grid grid-cols-4">
        <span className="absolute top-3 right-[12.5%] left-[12.5%] h-px bg-line" aria-hidden />
        {steps.map((title, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li key={title} className="relative flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "relative z-10 grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold",
                  done || current ? "bg-primary text-white" : "bg-white text-muted ring-1 ring-line",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-center font-display text-[12px] font-semibold",
                  current ? "text-title" : "text-muted",
                )}
              >
                {title}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-7 space-y-5">
        {step === 0 ? (
          <>
            <Field label="Full name *">
              <TextField value={form.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Joe Smith" />
            </Field>
            <Field label="Work email *">
              <TextField
                type="email"
                value={form.email}
                onChange={(e) => patch({ email: e.target.value })}
                placeholder="joe@business.com"
              />
            </Field>
            <Field label="Business phone *">
              <TextField
                value={form.phone}
                onChange={(e) => patch({ phone: e.target.value })}
                placeholder="(555) 000-0000"
              />
            </Field>
            <Field label="Password *">
              <PasswordField
                value={form.password}
                onChange={(e) => patch({ password: e.target.value })}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </Field>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <Field label="Business name *">
              <TextField
                value={form.businessName}
                onChange={(e) => patch({ businessName: e.target.value })}
                placeholder="Joe's Plumbing LLC"
              />
            </Field>
            <Field label="Primary trade *">
              <NativeSelect value={form.trade} onChange={(e) => patch({ trade: e.target.value })}>
                <option value="" disabled>
                  Select your primary trade
                </option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Short bio (optional)">
              <TextArea
                value={form.bio}
                onChange={(e) => patch({ bio: e.target.value })}
                placeholder="Briefly describe your experience and specialties (optional)."
              />
            </Field>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <Field label="Service ZIP *">
              <TextField
                value={form.serviceZip}
                onChange={(e) => patch({ serviceZip: e.target.value })}
                placeholder="78704"
              />
            </Field>
            <Field label="Travel radius *">
              <NativeSelect value={form.radius} onChange={(e) => patch({ radius: e.target.value })}>
                <option value="10">Within 10 miles</option>
                <option value="25">Within 25 miles</option>
                <option value="50">Within 50 miles</option>
                <option value="75">Within 75 miles</option>
                <option value="100">Within 100 miles</option>
              </NativeSelect>
            </Field>
          </>
        ) : null}
        {step === 3 ? (
          <div className="rounded-2xl border border-line bg-surface/50 p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-base font-semibold text-title">Background check</h2>
                <p className="mt-1 text-sm text-copy">
                  Identity and safety screening required before your professional listing goes live to local homeowners.
                </p>
              </div>
            </div>

            <label className="mt-4 flex items-start gap-2.5 text-sm text-copy">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-line"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                disabled={checkStatus === "running"}
              />
              I authorize a background check on the information I just submitted.
            </label>

            <div className="mt-4">
              {checkStatus === "idle" ? (
                <Button type="button" variant="ghost" onClick={runBackgroundCheck}>
                  Run background check
                </Button>
              ) : null}
              {checkStatus === "running" ? (
                <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking…
                </p>
              ) : null}
              {checkStatus === "clear" ? (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Clear — you can submit
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
      <div className="mt-6 flex flex-wrap gap-2">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => setStep((value) => value - 1)}>
            ← Back
          </Button>
        ) : null}
        <Button type="button" onClick={next} disabled={step === 3 && checkStatus === "running"}>
          {step < 3 ? "Next ↗" : "Submit application ↗"}
        </Button>
      </div>
      <AuthLinks prompt="Already have an account?" href="/login?role=pro" label="Sign in ↗" />
    </div>
  );
}
