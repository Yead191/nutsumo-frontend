import { redirect } from "next/navigation";
import getProfile from "@/helpers/next-fetch/core/getProfile";
import {
  getConversationsAction,
  startConversationAction,
} from "@/helpers/next-fetch/apiActions/chatActions";
import { ChatInbox } from "./ChatInbox";

export interface MessagesSearchParams {
  /** Conversation to open. */
  c?: string;
  /** Start (or reuse) a conversation with this user id. */
  to?: string;
  /** Aliases of `to` used by older links (booking cards, legacy pages). */
  recipient?: string;
  dm?: string;
  /** Optional job context for a new conversation. */
  job?: string;
}

const isObjectId = (value?: string) => !!value && /^[a-f\d]{24}$/i.test(value);

/**
 * Server wrapper shared by /account/messages and /pro/messages.
 * `?to=<userId>&job=<jobId>` opens a chat with that user, then redirects to `?c=<id>`.
 */
export async function MessagesPage({
  searchParams,
  basePath,
}: {
  searchParams: MessagesSearchParams;
  basePath: "/account/messages" | "/pro/messages";
}) {
  const me = await getProfile();
  if (!me) redirect(`/login?redirect=${basePath}`);

  let startError: string | null = null;
  const target = [searchParams.to, searchParams.recipient, searchParams.dm].find(isObjectId);
  if (target) {
    const started = await startConversationAction(target, isObjectId(searchParams.job) ? searchParams.job : undefined);
    if (started.success && started.data?._id) {
      redirect(`${basePath}?c=${started.data._id}`);
    }
    startError = started.message || "Couldn't start this conversation.";
  }

  const conversationsRes = await getConversationsAction();
  const conversations = conversationsRes.data || [];

  const apiOrigin = new URL(process.env.BASE_URL || "http://localhost:5005").origin;
  const filesBase = process.env.IMAGE_BASE_URL || `${apiOrigin}/files`;

  return (
    <div className="space-y-4">
      {startError ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {startError}
        </p>
      ) : null}
      {!conversationsRes.success && conversationsRes.message ? (
        <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Messages are temporarily unavailable: {conversationsRes.message}
        </p>
      ) : null}
      <ChatInbox
        me={{ id: String(me._id || me.id), role: me.role, name: me.name }}
        initialConversations={conversations}
        initialActiveId={searchParams.c && conversations.some((c) => c._id === searchParams.c) ? searchParams.c : null}
        socketUrl={process.env.SOCKET_URL || apiOrigin}
        filesBase={filesBase}
        basePath={basePath}
      />
    </div>
  );
}
