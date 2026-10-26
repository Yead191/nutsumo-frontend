import { Suspense } from "react";
import { MessagesInbox } from "@/components/web-pages/messages-inbox";

export default function ProMessagesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading inbox…</p>}>
      <MessagesInbox role="pro" />
    </Suspense>
  );
}
