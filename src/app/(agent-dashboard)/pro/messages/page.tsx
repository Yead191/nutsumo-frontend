import type { Metadata } from "next";
import { MessagesPage, type MessagesSearchParams } from "@/components/web-pages/chat/MessagesPage";

export const metadata: Metadata = { title: "Messages · Nutsumo" };

export default async function ProMessagesRoute({
  searchParams,
}: {
  searchParams: Promise<MessagesSearchParams>;
}) {
  return <MessagesPage searchParams={await searchParams} basePath="/pro/messages" />;
}
