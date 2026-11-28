"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Check,
  CheckCheck,
  ImagePlus,
  Loader2,
  MessageSquareText,
  Search,
  SendHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { acquireChatSocket, CHAT_EVENTS } from "@/lib/chat-socket";
import {
  getConversationsAction,
  getMessagesAction,
  markConversationReadAction,
  sendMessageAction,
  type IChatConversation,
  type IChatMessage,
  type IChatParticipant,
} from "@/helpers/next-fetch/apiActions/chatActions";

type Me = { id: string; role: string; name?: string };
type UiMessage = IChatMessage & { pending?: boolean; failed?: boolean };

const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const TYPING_IDLE_MS = 2500;

interface ChatInboxProps {
  me: Me;
  initialConversations: IChatConversation[];
  initialActiveId?: string | null;
  /** Origin of the API server (socket.io endpoint), e.g. http://localhost:5005 */
  socketUrl: string;
  /** Base URL that uploaded file paths are served from, e.g. http://localhost:5005/files */
  filesBase: string;
  /** Where this inbox lives, used to keep ?c= in the URL. */
  basePath: string;
}

/* ------------------------------------------------------------------ helpers */

function fileUrl(path: string | undefined, filesBase: string) {
  if (!path) return undefined;
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  if (path.startsWith("/asset")) return `${filesBase.replace(/\/files$/, "")}${path}`;
  return `${filesBase}${path.startsWith("/") ? "" : "/"}${path}`;
}

function initials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

function timeLabel(iso?: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const diffDays = (now.getTime() - date.getTime()) / 86_400_000;
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}

function dayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86_400_000);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
}

function otherParticipant(conversation: IChatConversation, meId: string): IChatParticipant | undefined {
  return conversation.participants.find((p) => p._id !== meId) ?? conversation.participants[0];
}

function Avatar({
  person,
  filesBase,
  size = "md",
}: {
  person?: IChatParticipant;
  filesBase: string;
  size?: "sm" | "md";
}) {
  const src = fileUrl(person?.image, filesBase);
  const box = size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm";
  return (
    <span className={cn("relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary", box)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- API host isn't in next/image remotePatterns
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(person?.name)
      )}
    </span>
  );
}

/* --------------------------------------------------------------- component */

export function ChatInbox({
  me,
  initialConversations,
  initialActiveId,
  socketUrl,
  filesBase,
  basePath,
}: ChatInboxProps) {
  const [conversations, setConversations] = useState<IChatConversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(initialActiveId ?? null);
  const [messages, setMessages] = useState<Record<string, UiMessage[]>>({});
  const [hasMore, setHasMore] = useState<Record<string, boolean>>({});
  const [loadingThread, setLoadingThread] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  const socketRef = useRef<ReturnType<typeof acquireChatSocket>["socket"] | null>(null);
  const activeIdRef = useRef(activeId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const myTypingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const amTyping = useRef(false);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const active = conversations.find((c) => c._id === activeId) ?? null;
  const activeOther = active ? otherParticipant(active, me.id) : undefined;
  const thread = activeId ? messages[activeId] : undefined;

  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  const scrollToBottom = useCallback((smooth = true) => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    });
  }, []);

  const refreshConversations = useCallback(async () => {
    const res = await getConversationsAction();
    if (res.success && res.data) setConversations(res.data);
  }, []);

  const markRead = useCallback((conversationId: string) => {
    setConversations((list) =>
      list.map((c) => (c._id === conversationId ? { ...c, unreadCount: 0 } : c)),
    );
    void markConversationReadAction(conversationId);
  }, []);

  /* ---- realtime ---- */
  useEffect(() => {
    const { socket, release } = acquireChatSocket(socketUrl);
    socketRef.current = socket;

    const onMessage = (message: IChatMessage) => {
      const conversationId = String(message.conversation);
      setMessages((all) => {
        const list = all[conversationId];
        if (!list) return all; // thread not loaded yet; it'll fetch fresh when opened
        if (list.some((m) => m._id === message._id)) return all;
        // Replace my optimistic copy if the socket beats the HTTP response.
        const pendingIndex =
          message.sender === me.id
            ? list.findIndex((m) => m.pending && m.text === message.text)
            : -1;
        const next = [...list];
        if (pendingIndex >= 0) next[pendingIndex] = message;
        else next.push(message);
        return { ...all, [conversationId]: next };
      });

      setConversations((list) => {
        if (!list.some((c) => c._id === conversationId)) {
          void refreshConversations(); // brand-new conversation started by the other side
          return list;
        }
        return list;
      });

      if (message.sender !== me.id) {
        setTyping((t) => ({ ...t, [conversationId]: false }));
        if (activeIdRef.current === conversationId && document.visibilityState === "visible") {
          markRead(conversationId);
        }
      }
      if (activeIdRef.current === conversationId) scrollToBottom();
    };

    const onConversation = (update: {
      _id: string;
      lastMessage?: string;
      lastMessageAt?: string;
      lastSender?: string;
      unread?: Record<string, number>;
    }) => {
      setConversations((list) => {
        const index = list.findIndex((c) => c._id === String(update._id));
        if (index < 0) return list;
        const isActive = activeIdRef.current === String(update._id);
        const updated: IChatConversation = {
          ...list[index],
          lastMessage: update.lastMessage,
          lastMessageAt: update.lastMessageAt,
          lastSender: update.lastSender ? String(update.lastSender) : null,
          unreadCount: isActive ? 0 : Number(update.unread?.[me.id] || 0),
        };
        return [updated, ...list.filter((_, i) => i !== index)];
      });
    };

    const onRead = ({ conversationId, readerId }: { conversationId: string; readerId: string }) => {
      if (readerId === me.id) return;
      setMessages((all) => {
        const list = all[conversationId];
        if (!list) return all;
        return {
          ...all,
          [conversationId]: list.map((m) =>
            m.sender === me.id && !m.readBy?.includes(readerId)
              ? { ...m, readBy: [...(m.readBy || []), readerId] }
              : m,
          ),
        };
      });
    };

    const onTyping = ({ conversationId, isTyping }: { conversationId: string; isTyping: boolean }) => {
      setTyping((t) => ({ ...t, [conversationId]: isTyping }));
      clearTimeout(typingTimers.current[conversationId]);
      if (isTyping) {
        // Safety net in case the "stopped typing" event never arrives.
        typingTimers.current[conversationId] = setTimeout(
          () => setTyping((t) => ({ ...t, [conversationId]: false })),
          6000,
        );
      }
    };

    // After a reconnect we may have missed events: resync the list.
    const onReconnect = () => void refreshConversations();

    socket.on(CHAT_EVENTS.MESSAGE, onMessage);
    socket.on(CHAT_EVENTS.CONVERSATION_UPDATED, onConversation);
    socket.on(CHAT_EVENTS.READ, onRead);
    socket.on(CHAT_EVENTS.TYPING, onTyping);
    socket.io.on("reconnect", onReconnect);

    const timers = typingTimers.current;
    return () => {
      socket.off(CHAT_EVENTS.MESSAGE, onMessage);
      socket.off(CHAT_EVENTS.CONVERSATION_UPDATED, onConversation);
      socket.off(CHAT_EVENTS.READ, onRead);
      socket.off(CHAT_EVENTS.TYPING, onTyping);
      socket.io.off("reconnect", onReconnect);
      Object.values(timers).forEach(clearTimeout);
      socketRef.current = null;
      release();
    };
  }, [socketUrl, me.id, markRead, refreshConversations, scrollToBottom]);

  /* ---- open a conversation ---- */
  const openConversation = useCallback(
    async (conversationId: string) => {
      setActiveId(conversationId);
      setDraft("");
      setFiles([]);
      window.history.replaceState(null, "", `${basePath}?c=${conversationId}`);
      markRead(conversationId);

      if (messages[conversationId]) {
        scrollToBottom(false);
        return;
      }
      setLoadingThread(true);
      const res = await getMessagesAction(conversationId);
      setLoadingThread(false);
      if (!res.success || !res.data) {
        toast.error(res.message || "Couldn't load messages");
        return;
      }
      setMessages((all) => ({ ...all, [conversationId]: res.data!.messages }));
      setHasMore((h) => ({ ...h, [conversationId]: res.data!.hasMore }));
      scrollToBottom(false);
    },
    [basePath, markRead, messages, scrollToBottom],
  );

  // Open the conversation from the URL on first render.
  const openedInitial = useRef(false);
  useEffect(() => {
    if (openedInitial.current || !initialActiveId) return;
    openedInitial.current = true;
    void openConversation(initialActiveId);
  }, [initialActiveId, openConversation]);

  const loadOlder = async () => {
    if (!activeId || !thread?.length || loadingOlder) return;
    const el = scrollRef.current;
    const previousHeight = el?.scrollHeight ?? 0;
    setLoadingOlder(true);
    const res = await getMessagesAction(activeId, thread[0].createdAt);
    setLoadingOlder(false);
    if (!res.success || !res.data) return;
    setMessages((all) => ({ ...all, [activeId]: [...res.data!.messages, ...(all[activeId] || [])] }));
    setHasMore((h) => ({ ...h, [activeId]: res.data!.hasMore }));
    // Keep the reader's position after prepending.
    requestAnimationFrame(() => {
      if (el) el.scrollTop = el.scrollHeight - previousHeight;
    });
  };

  /* ---- composing ---- */
  const emitTyping = (isTyping: boolean) => {
    if (!activeId || amTyping.current === isTyping) return;
    amTyping.current = isTyping;
    socketRef.current?.emit(CHAT_EVENTS.TYPING, { conversationId: activeId, isTyping });
  };

  const onDraftChange = (value: string) => {
    setDraft(value);
    emitTyping(value.trim().length > 0);
    if (myTypingTimer.current) clearTimeout(myTypingTimer.current);
    myTypingTimer.current = setTimeout(() => emitTyping(false), TYPING_IDLE_MS);
  };

  const onPickFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} isn't an image`);
        return false;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error(`${file.name} is larger than 5 MB`);
        return false;
      }
      return true;
    });
    setFiles((current) => [...current, ...picked].slice(0, MAX_IMAGES));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const send = async () => {
    if (!activeId || sending) return;
    const text = draft.trim();
    if (!text && files.length === 0) return;

    const conversationId = activeId;
    const tempId = `temp-${Date.now()}`;
    const optimistic: UiMessage = {
      _id: tempId,
      conversation: conversationId,
      sender: me.id,
      text,
      // Own object URLs: the composer previews are revoked as soon as files clear.
      images: files.map((file) => URL.createObjectURL(file)),
      readBy: [me.id],
      createdAt: new Date().toISOString(),
      pending: true,
    };
    const outgoingFiles = files;
    setMessages((all) => ({ ...all, [conversationId]: [...(all[conversationId] || []), optimistic] }));
    setDraft("");
    setFiles([]);
    emitTyping(false);
    scrollToBottom();

    const formData = new FormData();
    if (text) formData.append("text", text);
    outgoingFiles.forEach((file) => formData.append("images", file));

    setSending(true);
    const res = await sendMessageAction(conversationId, formData);
    setSending(false);

    setMessages((all) => {
      const list = all[conversationId] || [];
      if (!res.success || !res.data) {
        return { ...all, [conversationId]: list.map((m) => (m._id === tempId ? { ...m, pending: false, failed: true } : m)) };
      }
      const real = res.data;
      const alreadyThere = list.some((m) => m._id === real._id);
      const next = alreadyThere
        ? list.filter((m) => m._id !== tempId)
        : list.map((m) => (m._id === tempId ? real : m));
      return { ...all, [conversationId]: next };
    });
    if (!res.success) toast.error(res.message || "Message not sent. Please try again.");
  };

  /* ---- derived ---- */
  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const other = otherParticipant(c, me.id);
    return other?.name?.toLowerCase().includes(q) || c.job?.title?.toLowerCase().includes(q);
  });

  const jobHref = (jobId: string) => (me.role === "ARTISAN" ? `/pro/jobs/${jobId}` : `/account/jobs/${jobId}`);
  const browseHref = me.role === "ARTISAN" ? "/pro/jobs" : "/browse-pros";

  /* ---- render ---- */
  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      {/* Conversation list */}
      <aside
        className={cn(
          "flex w-full flex-col border-r border-slate-200 md:w-[320px] md:shrink-0",
          activeId ? "hidden md:flex" : "flex",
        )}
      >
        <div className="border-b border-slate-200 p-4">
          <h1 className="font-display text-xl font-semibold text-title">Messages</h1>
          <label className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary/50 focus-within:bg-white">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations"
              className="min-w-0 flex-1 bg-transparent text-sm text-title placeholder:text-slate-400 focus:outline-none"
            />
          </label>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-6 py-14 text-center">
              <MessageSquareText className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-title">
                {conversations.length === 0 ? "No conversations yet" : "No matches"}
              </p>
              {conversations.length === 0 ? (
                <>
                  <p className="mt-1 text-xs text-copy">
                    {me.role === "ARTISAN"
                      ? "Send a quotation on a job and you can chat with the client here."
                      : "Find a pro and tap “Message” to start a conversation."}
                  </p>
                  <Link
                    href={browseHref}
                    className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                  >
                    {me.role === "ARTISAN" ? "Find jobs" : "Browse pros"}
                  </Link>
                </>
              ) : null}
            </li>
          ) : (
            filtered.map((conversation) => {
              const other = otherParticipant(conversation, me.id);
              const unread = conversation.unreadCount || 0;
              const selected = conversation._id === activeId;
              const fromMe = conversation.lastSender === me.id;
              return (
                <li key={conversation._id}>
                  <button
                    type="button"
                    onClick={() => void openConversation(conversation._id)}
                    className={cn(
                      "flex w-full items-start gap-3 border-l-[3px] px-4 py-3.5 text-left transition cursor-pointer",
                      selected ? "border-primary bg-primary/5" : "border-transparent hover:bg-slate-50",
                    )}
                  >
                    <Avatar person={other} filesBase={filesBase} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={cn("truncate text-sm text-title", unread ? "font-bold" : "font-semibold")}>
                          {other?.name || "User"}
                        </span>
                        <span className="shrink-0 text-[11px] text-slate-400">
                          {timeLabel(conversation.lastMessageAt || conversation.updatedAt)}
                        </span>
                      </span>
                      {conversation.job?.title ? (
                        <span className="mt-0.5 block truncate text-[11px] font-medium text-primary">
                          {conversation.job.title}
                        </span>
                      ) : null}
                      <span className="mt-0.5 flex items-center gap-2">
                        <span className={cn("min-w-0 flex-1 truncate text-xs", unread ? "font-semibold text-title" : "text-copy")}>
                          {typing[conversation._id]
                            ? "typing…"
                            : conversation.lastMessage
                              ? `${fromMe ? "You: " : ""}${conversation.lastMessage}`
                              : "Say hello 👋"}
                        </span>
                        {unread > 0 ? (
                          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                            {unread > 99 ? "99+" : unread}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </aside>

      {/* Thread */}
      <section className={cn("min-w-0 flex-1 flex-col", activeId ? "flex" : "hidden md:flex")}>
        {!active ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div>
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                <MessageSquareText className="h-8 w-8" />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-title">Select a conversation</p>
              <p className="mt-1 max-w-xs text-sm text-copy">
                Messages are delivered instantly. Keep payments on Nutsumo so they stay protected by escrow.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
              <button
                type="button"
                aria-label="Back to conversations"
                onClick={() => {
                  setActiveId(null);
                  window.history.replaceState(null, "", basePath);
                }}
                className="grid h-9 w-9 place-items-center rounded-full text-title hover:bg-slate-100 md:hidden cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Avatar person={activeOther} filesBase={filesBase} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-title">{activeOther?.name || "User"}</p>
                <p className="truncate text-xs text-copy">
                  {typing[active._id] ? (
                    <span className="font-medium text-primary">typing…</span>
                  ) : activeOther?.role === "ARTISAN" ? (
                    "Professional"
                  ) : (
                    "Client"
                  )}
                </p>
              </div>
              {active.job ? (
                <Link
                  href={jobHref(active.job._id)}
                  className="hidden max-w-[45%] items-center gap-1.5 truncate rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-title hover:border-primary/50 hover:text-primary sm:inline-flex"
                >
                  <Briefcase className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{active.job.title}</span>
                </Link>
              ) : null}
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-slate-50/60 px-4 py-5 sm:px-6">
              {loadingThread && !thread ? (
                <div className="grid h-full place-items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {hasMore[active._id] ? (
                    <div className="mb-4 text-center">
                      <button
                        type="button"
                        onClick={() => void loadOlder()}
                        disabled={loadingOlder}
                        className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-copy hover:text-title disabled:opacity-60 cursor-pointer"
                      >
                        {loadingOlder ? "Loading…" : "Load earlier messages"}
                      </button>
                    </div>
                  ) : null}

                  {thread?.length === 0 ? (
                    <p className="py-10 text-center text-sm text-copy">
                      No messages yet. Say hello to {activeOther?.name?.split(" ")[0] || "them"} 👋
                    </p>
                  ) : null}

                  <ol className="space-y-1.5">
                    {thread?.map((message, index) => {
                      const mine = message.sender === me.id;
                      const previous = thread[index - 1];
                      const newDay =
                        !previous || new Date(previous.createdAt).toDateString() !== new Date(message.createdAt).toDateString();
                      const grouped = previous && previous.sender === message.sender && !newDay;
                      const seen = mine && (message.readBy || []).some((id) => id !== me.id);
                      return (
                        <li key={message._id}>
                          {newDay ? (
                            <div className="my-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                              <span className="h-px flex-1 bg-slate-200" />
                              {dayLabel(message.createdAt)}
                              <span className="h-px flex-1 bg-slate-200" />
                            </div>
                          ) : null}
                          <div className={cn("flex", mine ? "justify-end" : "justify-start", !grouped && "mt-3")}>
                            <div className={cn("max-w-[78%] sm:max-w-[65%]", message.pending && "opacity-70")}>
                              {message.images?.length ? (
                                <div className={cn("mb-1 grid gap-1", message.images.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
                                  {message.images.map((image) => {
                                    const src = fileUrl(image, filesBase);
                                    return (
                                      <a key={image} href={src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- API host isn't in next/image remotePatterns */}
                                        <img src={src} alt="Shared photo" className="max-h-64 w-full object-cover" />
                                      </a>
                                    );
                                  })}
                                </div>
                              ) : null}
                              {message.text ? (
                                <p
                                  className={cn(
                                    "whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed",
                                    mine
                                      ? "rounded-br-md bg-primary text-white"
                                      : "rounded-bl-md bg-white text-title ring-1 ring-slate-200",
                                  )}
                                >
                                  {message.text}
                                </p>
                              ) : null}
                              <p className={cn("mt-1 flex items-center gap-1 text-[10.5px] text-slate-400", mine ? "justify-end" : "justify-start")}>
                                {message.failed ? (
                                  <span className="font-semibold text-red-500">Not sent</span>
                                ) : message.pending ? (
                                  "Sending…"
                                ) : (
                                  timeLabel(message.createdAt)
                                )}
                                {mine && !message.pending && !message.failed ? (
                                  seen ? (
                                    <CheckCheck className="h-3.5 w-3.5 text-primary" aria-label="Seen" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" aria-label="Sent" />
                                  )
                                ) : null}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  {typing[active._id] ? (
                    <div className="mt-3 flex">
                      <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 ring-1 ring-slate-200" aria-label="typing">
                        {[0, 150, 300].map((delay) => (
                          <span
                            key={delay}
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                            style={{ animationDelay: `${delay}ms` }}
                          />
                        ))}
                      </span>
                    </div>
                  ) : null}
                </>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              className="border-t border-slate-200 bg-white p-3 sm:p-4"
            >
              {files.length ? (
                <div className="mb-3 flex flex-wrap gap-2">
                  {previews.map((url, index) => (
                    <span key={url} className="relative h-16 w-16 overflow-hidden rounded-lg ring-1 ring-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        aria-label="Remove image"
                        onClick={() => setFiles((list) => list.filter((_, i) => i !== index))}
                        className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => onPickFiles(e.target.files)}
                />
                <button
                  type="button"
                  aria-label="Attach photos"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={files.length >= MAX_IMAGES}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-copy hover:bg-slate-100 hover:text-title disabled:opacity-40 cursor-pointer"
                >
                  <ImagePlus className="h-5 w-5" />
                </button>
                <textarea
                  value={draft}
                  onChange={(e) => onDraftChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  rows={1}
                  placeholder="Type a message…"
                  className="max-h-36 min-h-11 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14.5px] text-title placeholder:text-slate-400 field-sizing-content focus:border-primary/50 focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={sending || (!draft.trim() && files.length === 0)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-white transition hover:bg-primary-hover disabled:opacity-40 cursor-pointer"
                >
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 hidden text-[11px] text-slate-400 sm:block">
                Enter to send · Shift + Enter for a new line · Keep payments on Nutsumo to stay escrow-protected
              </p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
