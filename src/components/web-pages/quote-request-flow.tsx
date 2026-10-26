"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, NativeSelect, TextArea } from "@/components/ui/field";
import { categories, getPro, professionals } from "@/Mockdata";
import { labelForAnswer, questionsForCategory } from "@/lib/intake-questions";
import { matchEligiblePros } from "@/lib/matching";
import { loginAs } from "@/redux/slices/authSlice";
import { clearDraft } from "@/redux/slices/intakeSlice";
import { addJob } from "@/redux/slices/marketplaceSlice";
import { addNotification, invitePro, setJobPhotos, type SavedAddress } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { IntakeAnswer, JobVisibility, Professional, Urgency, User } from "@/types";
import { cn } from "@/lib/cn";

type Phase = "category" | "questions" | "details" | "matches" | "sent";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function urgencyFromWhen(value?: string): Urgency {
  if (value === "asap") return "asap";
  if (value === "flexible") return "flexible";
  if (value === "two_weeks") return "two_weeks";
  return "this_week";
}

function fiveDigitZip(value?: string) {
  const match = value?.trim().match(/\d{5}/);
  return match?.[0] ?? "";
}

function resolveJobLocation(
  draftZip: string,
  user: User | null,
  addresses: SavedAddress[],
) {
  const home = addresses.find((item) => item.label.toLowerCase() === "home") ?? addresses[0];
  const zip =
    fiveDigitZip(user?.zip) ||
    fiveDigitZip(home?.zip) ||
    fiveDigitZip(draftZip) ||
    "78701";
  return {
    zip,
    city: home?.city || user?.city || "Austin",
    state: home?.state || user?.state || "TX",
  };
}

function readPhotos(files: FileList | null): Promise<string[]> {
  const list = Array.from(files ?? []).slice(0, 4);
  return Promise.all(
    list.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result ?? ""));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }),
    ),
  );
}

export function QuoteRequestFlow() {
  const searchParams = useSearchParams();
  const invitedPro = getPro(searchParams.get("invite") ?? "");
  const draft = useAppSelector((state) => state.intake.draft);
  const user = useAppSelector((state) => state.auth.user);
  const addresses = useAppSelector((state) => state.features.addresses);
  const listingStatus = useAppSelector((state) => state.admin.listingStatus);
  const dispatch = useAppDispatch();

  const location = useMemo(
    () => resolveJobLocation(draft.zip, user, addresses),
    [addresses, draft.zip, user],
  );

  const startingSlug = invitedPro?.categorySlug || draft.categorySlug || "";
  const [categorySlug, setCategorySlug] = useState(startingSlug);
  const [answers, setAnswers] = useState<Record<string, string>>(draft.answers ?? {});
  const [index, setIndex] = useState(0);
  const [description, setDescription] = useState(draft.problem || draft.summary || "");
  const [budget, setBudget] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>(startingSlug ? "questions" : "category");
  const [requestedPro, setRequestedPro] = useState<Professional | null>(invitedPro ?? null);
  const [publishedOpen, setPublishedOpen] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);

  const questions = useMemo(() => questionsForCategory(categorySlug), [categorySlug]);
  const question = questions[index];
  const category = categories.find((item) => item.slug === categorySlug);
  const matches = useMemo(
    () =>
      matchEligiblePros(
        { categorySlug, zip: location.zip, city: location.city },
        professionals,
        listingStatus,
      ),
    [categorySlug, listingStatus, location.city, location.zip],
  );

  const intakeAnswers: IntakeAnswer[] = questions
    .filter((item) => answers[item.id])
    .map((item) => ({
      id: item.id,
      label: item.prompt,
      value: labelForAnswer(categorySlug, item.id, answers[item.id]),
    }));

  const showCategory = !invitedPro && !startingSlug;
  const totalSteps = (showCategory ? 1 : 0) + questions.length + 2;
  const currentStep =
    phase === "category"
      ? 1
      : phase === "questions"
        ? (showCategory ? 1 : 0) + index + 1
        : phase === "details"
          ? (showCategory ? 1 : 0) + questions.length + 1
          : (showCategory ? 1 : 0) + questions.length + 2;

  function pickCategory(slug: string) {
    setCategorySlug(slug);
    setAnswers({});
    setIndex(0);
    setPhase("questions");
  }

  function pickAnswer(value: string) {
    if (!question) return;
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }
    setPhase("details");
  }

  function goBack() {
    if (phase === "matches") {
      setPhase("details");
      return;
    }
    if (phase === "details") {
      if (questions.length) {
        setPhase("questions");
        setIndex(questions.length - 1);
        return;
      }
      if (!invitedPro) setPhase("category");
      return;
    }
    if (phase === "questions" && index > 0) {
      setIndex(index - 1);
      return;
    }
    if (phase === "questions" && !invitedPro) {
      setPhase("category");
    }
  }

  function publishJob(pro?: Professional) {
    const title = [category?.name, intakeAnswers[0]?.value].filter(Boolean).join(" · ");
    const fullDescription = (description.trim() || draft.problem || "").trim();
    const createdId = `job-local-${Date.now()}`;
    const visibility: JobVisibility = pro ? "direct" : "open";
    const matchedIds = pro ? [pro.id] : matches.map((item) => item.id);

    if (!user) {
      dispatch(loginAs("homeowner"));
    }

    dispatch(
      addJob({
        id: createdId,
        title: title || category?.name || "Service request",
        categorySlug,
        description: fullDescription,
        zip: location.zip,
        city: location.city,
        state: location.state,
        urgency: urgencyFromWhen(answers.when),
        budget: budget.trim() || undefined,
        homeownerName: user?.name ?? "Maya Chen",
        intakeAnswers,
        requestedProId: pro?.id,
        visibility,
        photos,
        matchedProIds: matchedIds,
      }),
    );
    if (photos.length) {
      dispatch(setJobPhotos({ jobId: createdId, photos }));
    }

    if (pro) {
      dispatch(invitePro({ jobId: createdId, proId: pro.id }));
      dispatch(
        addNotification({
          title: "Quote request",
          body: `${user?.name ?? "A homeowner"} asked you to quote ${title || "a job"} in ${location.zip}.`,
          href: `/pro/jobs/${createdId}`,
          createdAt: "Just now",
          role: "pro",
        }),
      );
      dispatch(
        addNotification({
          title: "Request sent",
          body: `${pro.name} has your details and can send a quotation. Hiring is not confirmed until you accept it.`,
          href: `/account/jobs/${createdId}`,
          createdAt: "Just now",
          role: "homeowner",
        }),
      );
    } else {
      if (matchedIds.includes("pro-1")) {
        dispatch(
          addNotification({
            title: "New matching job",
            body: `${title || "A new request"} was posted in ${location.zip}. Review and send a quotation.`,
            href: `/pro/jobs/${createdId}`,
            createdAt: "Just now",
            role: "pro",
          }),
        );
      }
      dispatch(
        addNotification({
          title: "Job published",
          body: `${matchedIds.length} matching professional${matchedIds.length === 1 ? "" : "s"} can now send quotations.`,
          href: `/account/jobs/${createdId}`,
          createdAt: "Just now",
          role: "homeowner",
        }),
      );
    }

    dispatch(clearDraft());
    setRequestedPro(pro ?? null);
    setPublishedOpen(!pro);
    setMatchedCount(matchedIds.length);
    setJobId(createdId);
    setPhase("sent");
  }

  if (phase === "sent" && jobId) {
    return (
      <div className="w-full rounded-[22px] border border-line/80 bg-white p-6 sm:p-8">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-700">
          <Check className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-title">
          {publishedOpen ? "Job posted" : "Quote requested"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-copy">
          {publishedOpen
            ? `${matchedCount} matching professional${matchedCount === 1 ? "" : "s"} can review this job and send quotations. You hire only after you accept one.`
            : `${requestedPro?.name} has your details and can send a quotation. Viewing a profile or sending this request is not a booking.`}
        </p>
        <div className="mt-5 rounded-2xl border border-line/80 px-4 py-3">
          <p className="font-display text-sm font-semibold text-title">
            {requestedPro?.name ?? category?.name ?? "Open request"}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {category?.name} · {location.city} {location.zip} · Pay the pro directly if you hire
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button href={`/account/jobs/${jobId}`} size="md">
            View request
          </Button>
          <Button href="/account" variant="ghost" size="md">
            Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {phase !== "category" ? (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-title"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <p className="text-xs text-muted">{category?.name}</p>
        </div>
      ) : null}

      <div className="h-1 overflow-hidden rounded-full bg-smoke">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${Math.min(100, (currentStep / Math.max(totalSteps, 1)) * 100)}%` }}
        />
      </div>

      <div className="rounded-[22px] border border-line/80 bg-white p-6 sm:p-8">
        {phase === "category" ? (
          <>
            <h1 className="font-display text-2xl font-semibold text-title">
              What do you need help with?
            </h1>
            <p className="mt-1 text-sm text-muted">
              Pick a service, then answer a few questions. Posting does not hire anyone.
            </p>
            <div className="mt-5 grid gap-2">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => pickCategory(item.slug)}
                  className="rounded-2xl border border-line px-4 py-3 text-left transition hover:border-primary/40"
                >
                  <span className="font-display text-sm font-semibold text-title">{item.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">{item.summary}</span>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {phase === "questions" && question ? (
          <>
            <p className="text-xs font-medium text-muted">
              {index + 1} of {questions.length}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-title">
              {question.prompt}
            </h1>
            <div className="mt-5 grid gap-2">
              {question.options.map((option) => {
                const selected = answers[question.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => pickAnswer(option.value)}
                    className={cn(
                      "rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition",
                      selected
                        ? "border-primary bg-primary/[0.04] text-title"
                        : "border-line text-copy hover:border-primary/40",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {phase === "details" ? (
          <>
            <h1 className="font-display text-2xl font-semibold text-title">Job details</h1>
            <p className="mt-1 text-sm text-muted">
              Add a short description. Budget and photos are optional. Posting does not hire anyone.
            </p>
            <div className="mt-5 space-y-4">
              <Field label="Describe the work">
                <TextArea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What is broken, where it is, and any access notes."
                  rows={4}
                />
              </Field>
              <Field label="Budget (optional)">
                <NativeSelect value={budget} onChange={(event) => setBudget(event.target.value)}>
                  <option value="">No budget listed</option>
                  <option value="Under $250">Under $250</option>
                  <option value="$250–$500">$250–$500</option>
                  <option value="$500–$1,000">$500–$1,000</option>
                  <option value="$1,000–$5,000">$1,000–$5,000</option>
                  <option value="$5,000+">$5,000+</option>
                </NativeSelect>
              </Field>
              <Field label="Photos (optional, up to 4)">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="block w-full text-sm text-copy file:mr-3 file:rounded-full file:border-0 file:bg-smoke file:px-3 file:py-1.5 file:text-xs file:font-semibold"
                  onChange={async (event) => {
                    const next = await readPhotos(event.target.files);
                    setPhotos(next);
                  }}
                />
              </Field>
              {photos.length ? (
                <div className="grid grid-cols-4 gap-2">
                  {photos.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src.slice(0, 24)} src={src} alt="" className="h-16 w-full rounded-lg object-cover" />
                  ))}
                </div>
              ) : null}
            </div>
            <Button
              type="button"
              size="md"
              className="mt-5"
              disabled={description.trim().length < 8 && !draft.problem}
              onClick={() => setPhase("matches")}
            >
              Continue
            </Button>
          </>
        ) : null}

        {phase === "matches" ? (
          <>
            <h1 className="font-display text-2xl font-semibold text-title">
              {invitedPro ? `Request a quote from ${invitedPro.name}` : "Publish or request a pro"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {invitedPro
                ? "They receive this job and can send a quotation. You accept later to confirm the booking."
                : "Post to matching professionals in this service area, or send the same job to one pro."}
            </p>

            {intakeAnswers.length ? (
              <ul className="mt-4 space-y-1.5 text-sm text-copy">
                {intakeAnswers.map((item) => (
                  <li key={item.id} className="flex justify-between gap-4">
                    <span className="text-muted">{item.label}</span>
                    <span className="font-medium text-title">{item.value}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {!invitedPro ? (
              <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/[0.03] p-4">
                <p className="font-display text-sm font-semibold text-title">
                  Post job and receive quotations
                </p>
                <p className="mt-1 text-xs text-muted">
                  {matches.length} cleared professional{matches.length === 1 ? "" : "s"} in this trade and radius can
                  review it.
                </p>
                <Button type="button" size="sm" className="mt-3" onClick={() => publishJob()}>
                  Publish job
                </Button>
              </div>
            ) : null}

            <div className="mt-5 space-y-2">
              {(invitedPro ? [invitedPro] : matches).map((pro) => (
                <div key={pro.id} className="flex items-center gap-3 rounded-2xl border border-line/80 p-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-title text-sm font-semibold text-white">
                    {initials(pro.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 font-display text-sm font-semibold text-title">
                      {pro.name}
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                      <span className="inline-flex items-center gap-1 text-title">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                        {pro.rating.toFixed(1)}
                      </span>
                      <span>({pro.reviewCount})</span>
                      <span>·</span>
                      <span>{pro.city}</span>
                    </p>
                  </div>
                  <Button type="button" size="sm" onClick={() => publishJob(pro)}>
                    Request quote
                  </Button>
                </div>
              ))}
              {!invitedPro && matches.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">
                  No cleared professionals in this trade and radius yet. You can still publish the job.
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
