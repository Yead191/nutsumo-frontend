import { Suspense } from "react";
import { MessagesInbox } from "@/components/web-pages/messages-inbox";

export default function MessagesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading inbox…</p>}>
      <MessagesInbox />
    </Suspense>
  );
}
