"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  FileText,
  MapPin,
  Paperclip,
  Search,
  Send,
  Star,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { useRoleAccess } from "@/hooks/use-role-access";
import { getPro, threads as seedThreads } from "@/Mockdata";
import type { ChatMessage, MessageThread, Professional } from "@/types";

type PendingFile = {
  name: string;
  size: string;
  type: string;
  url?: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function previewLine(thread: MessageThread, role: "homeowner" | "pro") {
  const mine = role === "homeowner" ? "homeowner" : "pro";
  const who = thread.lastSender === mine ? "You" : role === "homeowner" ? thread.otherParty : "Maya Chen";
  return `${who}: ${thread.lastMessage}`;
}

function buildDirectThread(proId: string): MessageThread | null {
  const pro = getPro(proId);
  if (!pro) return null;
  const threadId = `dm-${pro.id}`;
  return {
    id: threadId,
    jobId: `dm:${pro.id}`,
    jobTitle: `Chat with ${pro.name}`,
    otherParty: pro.name,
    proId: pro.id,
    unread: 0,
    lastMessage: "Say hello and share photos of the job.",
    lastSender: "homeowner",
    updatedAt: "Just now",
    isDirect: true,
    messages: [
      {
        id: `${threadId}-0`,
        sender: "pro",
        senderName: pro.name,
        body: `Hi — thanks for reaching out. I'm ${pro.name} (${pro.trade}). Share a few details or photos and I’ll follow up.`,
        sentAt: "Just now",
        read: true,
      },
    ],
  };
}

export function MessagesInbox({ role = "homeowner" }: { role?: "homeowner" | "pro" }) {
  const { access } = useRoleAccess();
  const searchParams = useSearchParams();
  const dmProId = searchParams.get("dm");
  const fileInput = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProDetails, setShowProDetails] = useState(false);

  const [threads, setThreads] = useState(() => {
    let list =
      role === "pro"
        ? seedThreads.map((thread) => ({
            ...thread,
            otherParty: "Maya Chen",
            unread: thread.lastSender === "homeowner" ? Math.max(thread.unread, 1) : 0,
          }))
        : seedThreads;

    if (role === "homeowner" && dmProId) {
      const dt = buildDirectThread(dmProId);
      if (dt && !list.some((t) => t.id === dt.id)) {
        list = [dt, ...list];
      }
    }
    return list;
  });

  const [activeId, setActiveId] = useState(() => {
    if (role === "homeowner" && dmProId) {
      return `dm-${dmProId}`;
    }
    return threads[0]?.id ?? "";
  });
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<PendingFile | null>(null);
  const [fileError, setFileError] = useState("");
  const [mobileChat, setMobileChat] = useState(() => Boolean(role === "homeowner" && dmProId));
  const jobBase = role === "pro" ? "/pro/jobs" : "/account/jobs";
  const mySender = role === "pro" ? "pro" : "homeowner";
  const myName = role === "pro" ? "Ortega Plumbing" : "Maya Chen";
  const canSend = role === "homeowner" ? access.canHomeownerMessage : access.canProMessage;

  const [prevDmProId, setPrevDmProId] = useState(dmProId);
  if (dmProId && dmProId !== prevDmProId && role === "homeowner") {
    setPrevDmProId(dmProId);
    const dt = buildDirectThread(dmProId);
    if (dt) {
      if (!threads.some((t) => t.id === dt.id)) {
        setThreads((list) => [dt, ...list]);
      }
      setActiveId(dt.id);
      setMobileChat(true);
    }
  }

  const active = useMemo(
    () => threads.find((thread) => thread.id === activeId) ?? null,
    [activeId, threads],
  );

  // Get active pro information for profile drawer
  const activePro: Professional | null = useMemo(() => {
    if (!active) return null;
    if (active.proId) {
      const found = getPro(active.proId);
      if (found) return found;
    }
    // Fallback: search by business name
    return getPro("pro-1") ?? null;
  }, [active]);

  const activeContactName = role === "homeowner" && activePro?.name ? activePro.name : (active?.otherParty ?? "");

  const filteredThreads = useMemo(() => {
    if (!searchQuery.trim()) return threads;
    const q = searchQuery.toLowerCase();
    return threads.filter(
      (t) =>
        t.otherParty.toLowerCase().includes(q) ||
        t.jobTitle.toLowerCase().includes(q) ||
        t.lastMessage.toLowerCase().includes(q),
    );
  }, [searchQuery, threads]);

  function openThread(id: string) {
    setActiveId(id);
    setMobileChat(true);
    setFile(null);
    setFileError("");
    setThreads((list) =>
      list.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              unread: 0,
              messages: thread.messages.map((message) => ({ ...message, read: true })),
            }
          : thread,
      ),
    );
  }

  function onFilePick(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0];
    event.target.value = "";
    if (!picked) return;
    if (picked.size > 10 * 1024 * 1024) {
      setFileError("Keep files under 10 MB.");
      return;
    }
    setFileError("");
    const pending: PendingFile = {
      name: picked.name,
      size: formatSize(picked.size),
      type: picked.type || "file",
    };
    if (picked.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFile({ ...pending, url: reader.result });
        }
      };
      reader.readAsDataURL(picked);
      return;
    }
    setFile(pending);
  }

  function sendReply(event: React.FormEvent) {
    event.preventDefault();
    if (!canSend) {
      setFileError(access.blockedReason ?? "Messaging is locked for this role state.");
      return;
    }
    const body = draft.trim();
    if ((!body && !file) || !active) return;

    const message: ChatMessage = {
      id: `local-${Date.now()}`,
      sender: mySender,
      senderName: myName,
      body: body || (file ? `Sent ${file.name}` : ""),
      sentAt: "Just now",
      read: false,
      attachment: file
        ? { name: file.name, size: file.size, type: file.type, url: file.url }
        : undefined,
    };

    setThreads((list) =>
      list.map((thread) => {
        if (thread.id !== active.id) return thread;
        return {
          ...thread,
          messages: [...thread.messages, message],
          lastMessage: file && !body ? `Attachment: ${file.name}` : body,
          lastSender: mySender,
          updatedAt: "Just now",
          unread: 0,
        };
      }),
    );
    setDraft("");
    setFile(null);
    setFileError("");
  }

  return (
    <div className="flex h-[calc(100dvh-7.5rem)] w-full min-w-0 flex-col md:h-[calc(100dvh-8rem)]">
      {/* Main Inbox Window */}
      <div className="min-h-0 w-full min-w-0 flex-1 overflow-hidden rounded-[20px] border border-line/80 bg-white shadow-xs">
        <div className="flex h-full w-full min-w-0">
          {/* ========================================================== */}
          {/* LEFT COLUMN: Clean, Clutter-Free Thread List               */}
          {/* ========================================================== */}
          <aside
            className={cn(
              "flex min-h-0 w-full min-w-0 flex-col border-line/70 lg:w-[350px] lg:shrink-0 lg:border-r",
              mobileChat ? "hidden lg:flex" : "flex",
            )}
          >
            {/* Inbox Search & Counter */}
            <div className="border-b border-line/70 p-3.5 space-y-2.5 bg-smoke/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-display text-[15px] font-bold text-title">Inbox</p>
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 font-display text-[11px] font-bold text-primary">
                    {threads.length}
                  </span>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full rounded-[10px] border border-line/70 bg-white pl-8 pr-3 py-1.5 font-sans text-xs text-title placeholder:text-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Conversation List */}
            <ul className="min-h-0 flex-1 divide-y divide-line/60 overflow-y-auto">
              {filteredThreads.map((thread) => {
                const selected = thread.id === activeId;
                const pro = thread.proId ? getPro(thread.proId) : null;
                const contactName = role === "homeowner" && pro?.name ? pro.name : thread.otherParty;

                return (
                  <li key={thread.id}>
                    <button
                      type="button"
                      onClick={() => openThread(thread.id)}
                      className={cn(
                        "group flex w-full items-start gap-3.5 p-4 text-left transition-all duration-150 relative",
                        selected
                          ? "bg-primary/5 border-l-4 border-primary"
                          : "hover:bg-smoke/80 border-l-4 border-transparent",
                      )}
                    >
                      {/* Avatar */}
                      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-[#00a1de] font-display text-xs font-bold text-white shadow-xs">
                        {initials(contactName)}
                        {thread.unread > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-primary" />
                        )}
                      </span>

                      {/* Content block */}
                      <div className="min-w-0 flex-1">
                        {/* Row 1: Name and Timestamp */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display text-[14.5px] font-semibold text-title truncate group-hover:text-primary transition-colors">
                            {contactName}
                          </span>
                          <span className="shrink-0 text-[11px] text-muted font-medium">
                            {thread.updatedAt}
                          </span>
                        </div>

                        {/* Row 2: Job Subject Tag */}
                        <div className="mt-1">
                          <span className="inline-block max-w-[210px] truncate rounded-[6px] bg-smoke px-2 py-0.5 font-sans text-[11px] font-medium text-title/80 border border-line/50">
                            {thread.jobTitle}
                          </span>
                        </div>

                        {/* Row 3: Last Message + Unread Pill */}
                        <div className="mt-1.5 flex items-center justify-between gap-2">
                          <p className="min-w-0 flex-1 truncate font-sans text-[12.5px] leading-relaxed text-[#666]">
                            {previewLine(thread, role)}
                          </p>
                          {thread.unread > 0 ? (
                            <span className="grid h-5 min-w-[20px] shrink-0 place-items-center rounded-full bg-primary px-1.5 font-display text-[11px] font-bold text-white shadow-xs">
                              {thread.unread}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}

              {!filteredThreads.length && (
                <li className="p-8 text-center text-sm text-muted">
                  No conversations match your search.
                </li>
              )}
            </ul>
          </aside>

          {/* ========================================================== */}
          {/* MIDDLE COLUMN: Chat Area                                   */}
          {/* ========================================================== */}
          <section
            className={cn(
              "min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
              mobileChat ? "flex" : "hidden lg:flex",
            )}
          >
            {active ? (
              <>
                {/* Chat Top Header: Clickable Avatar & Name opens Details! */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-line/70 px-4 md:px-6 bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-title lg:hidden hover:bg-smoke"
                      onClick={() => setMobileChat(false)}
                      aria-label="Back to inbox"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>

                    {/* CLICKABLE PRO AVATAR */}
                    <button
                      type="button"
                      onClick={() => setShowProDetails((prev) => !prev)}
                      className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-[#00a1de] font-display text-xs font-bold text-white shadow-xs hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer"
                      title="Click to view contractor details"
                    >
                      {initials(activeContactName)}
                    </button>

                    {/* CLICKABLE PRO NAME & JOB TITLE */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowProDetails((prev) => !prev)}
                          className="truncate font-display text-[15px] font-semibold text-title hover:text-primary transition-colors text-left cursor-pointer"
                          title="Click to view contractor details"
                        >
                          {activeContactName}
                        </button>
                      </div>
                      <p className="truncate text-xs text-[#666]">{active.jobTitle}</p>
                    </div>
                  </div>

                  {/* Right Header Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {active.jobId && !active.jobId.startsWith("dm:") && (
                      <Link
                        href={`${jobBase}/${active.jobId}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-white px-3 py-1.5 font-display text-xs font-semibold text-title hover:bg-smoke transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        <span className="hidden sm:inline">View Request</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Message Bubbles Area */}
                <div className="min-h-0 w-full min-w-0 flex-1 space-y-3.5 overflow-y-auto bg-surface/30 p-5 md:p-6">
                  {active.messages.map((message) => {
                    const mine = message.sender === mySender;
                    return (
                      <div
                        key={message.id}
                        className={cn("flex w-full min-w-0", mine ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "inline-block w-fit max-w-[78%] px-4 py-3 text-left text-sm leading-relaxed [overflow-wrap:anywhere] shadow-xs",
                            mine
                              ? "rounded-[18px] rounded-tr-[4px] bg-primary text-white"
                              : "rounded-[18px] rounded-tl-[4px] border border-line/80 bg-white text-title",
                          )}
                        >
                          {message.body ? (
                            <p className={cn("text-[14px] leading-relaxed", mine ? "text-white" : "text-title")}>
                              {message.body}
                            </p>
                          ) : null}
                          {message.attachment ? (
                            <div
                              className={cn(
                                "mt-2.5 max-w-[240px] overflow-hidden rounded-[10px]",
                                mine ? "bg-white/20" : "bg-smoke",
                              )}
                            >
                              <div className="flex items-center gap-2 px-3 py-2">
                                <FileText className={cn("h-4 w-4 shrink-0", mine ? "text-white" : "text-primary")} />
                                <div className="min-w-0">
                                  <p className={cn("truncate text-[12px] font-semibold", mine ? "text-white" : "text-title")}>
                                    {message.attachment.name}
                                  </p>
                                  <p className={cn("text-[11px]", mine ? "text-white/80" : "text-muted")}>
                                    {message.attachment.size}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}
                          <p className={cn("mt-1.5 text-[11px] leading-none", mine ? "text-white/80" : "text-muted")}>
                            {message.sentAt}
                            {mine ? ` · ${message.read ? "Seen" : "Sent"}` : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Form Area */}
                <form onSubmit={sendReply} className="shrink-0 border-t border-line/70 bg-white p-4">
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf,.doc,.docx"
                    className="hidden"
                    onChange={onFilePick}
                  />
                  <TextArea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={canSend ? `Reply to ${activeContactName || active.otherParty}…` : "Messaging locked"}
                    className="min-h-[70px] rounded-[12px] border-line/80"
                    rows={2}
                    disabled={!canSend}
                  />
                  {file ? (
                    <div className="mt-2.5 flex items-center gap-2.5 rounded-[10px] border border-line bg-smoke px-3 py-2">
                      {file.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={file.url} alt="" className="h-9 w-9 rounded-[8px] object-cover" />
                      ) : (
                        <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-white text-primary">
                          <FileText className="h-4 w-4" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-title">{file.name}</p>
                        <p className="text-[11px] text-muted">{file.size}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove file"
                        className="grid h-7 w-7 place-items-center text-muted hover:text-title"
                        onClick={() => setFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                  {fileError ? <p className="mt-2 text-sm text-error">{fileError}</p> : null}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={!canSend}
                      onClick={() => fileInput.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                      Attach File
                    </Button>
                    <Button type="submit" size="sm" disabled={!canSend || (!draft.trim() && !file)}>
                      <Send className="h-4 w-4" />
                      {canSend ? "Send Message" : "Locked"}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="grid flex-1 place-items-center px-6 text-center">
                <div>
                  <p className="font-display text-lg font-bold text-title">No conversation selected</p>
                  <p className="mt-1 text-sm text-copy">Pick a thread from the inbox.</p>
                </div>
              </div>
            )}
          </section>

          {/* ========================================================== */}
          {/* RIGHT COLUMN: PRO DETAILS PANEL / DRAWER                    */}
          {/* Triggered on profile click!                                */}
          {/* ========================================================== */}
          {showProDetails && active && (
            <aside className="w-full sm:w-[320px] lg:w-[340px] shrink-0 border-l border-line/70 bg-white p-5 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right-4 duration-200">
              <div className="space-y-5">
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-3 border-b border-line/60">
                  <p className="font-display text-sm font-bold text-title">Contractor Details</p>
                  <button
                    type="button"
                    onClick={() => setShowProDetails(false)}
                    className="grid h-7 w-7 place-items-center rounded-full hover:bg-smoke text-muted hover:text-title"
                    title="Close details"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Profile Identity Card */}
                <div className="text-center space-y-2">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] bg-gradient-to-br from-primary to-[#00a1de] font-display text-xl font-bold text-white shadow-md">
                    {initials(activeContactName)}
                  </div>
                  <div>
                    <h3 className="font-display text-[17px] font-semibold text-title">
                      {activeContactName}
                    </h3>
                  </div>
                  {activePro?.rating && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{activePro.rating.toFixed(1)}</span>
                      <span className="font-normal text-muted">({activePro.reviewCount} reviews)</span>
                    </div>
                  )}
                </div>

                {/* Quick Info Grid */}
                <div className="rounded-[14px] bg-smoke/70 p-3.5 space-y-2.5 border border-line/50 text-xs">
                  {activePro?.trade && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted flex items-center gap-1.5">
                        <Wrench className="h-3.5 w-3.5 text-primary" /> Trade
                      </span>
                      <span className="font-semibold text-title">{activePro.trade}</span>
                    </div>
                  )}

                  {activePro?.city && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" /> Location
                      </span>
                      <span className="font-semibold text-title">
                        {activePro.city}, {activePro.state} (~{activePro.radiusMiles} mi)
                      </span>
                    </div>
                  )}

                  {activePro?.yearsInBusiness && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> Experience
                      </span>
                      <span className="font-semibold text-title">{activePro.yearsInBusiness}</span>
                    </div>
                  )}

                  {activePro?.startingPrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted flex items-center gap-1.5">
                        Starting Rate
                      </span>
                      <span className="font-bold text-primary font-display text-[13px]">
                        ${activePro.startingPrice}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bio Snippet */}
                {activePro?.bio && (
                  <div>
                    <p className="font-display text-xs font-bold text-title uppercase tracking-wider mb-1.5">
                      About Pro
                    </p>
                    <p className="font-sans text-xs leading-relaxed text-[#555]">
                      {activePro.bio}
                    </p>
                  </div>
                )}

                {/* Linked Request Details */}
                <div className="rounded-[12px] border border-line/70 p-3 bg-white">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Active Repair Request
                  </p>
                  <p className="mt-1 font-display text-xs font-bold text-title truncate">
                    {active.jobTitle}
                  </p>
                  {active.jobId && !active.jobId.startsWith("dm:") && (
                    <Link
                      href={`${jobBase}/${active.jobId}`}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                    >
                      <span>Open repair estimate</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Action Buttons at bottom of Details Panel */}
              <div className="pt-4 border-t border-line/60 space-y-2">
                {activePro?.id && (
                  <Link
                    href={`/browse-pros/${activePro.id}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors active:scale-[0.99]"
                  >
                    <span>View Full Public Profile ↗</span>
                  </Link>
                )}
                {active.jobId && !active.jobId.startsWith("dm:") && (
                  <Link
                    href={`${jobBase}/${active.jobId}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-full border border-line bg-white px-4 py-2.5 text-xs font-semibold text-title hover:bg-smoke hover:border-primary/40 hover:text-primary transition-colors active:scale-[0.99]"
                  >
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>View Repair Quote &amp; Details ↗</span>
                  </Link>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
