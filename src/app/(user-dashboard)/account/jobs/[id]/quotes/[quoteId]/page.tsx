import { QuoteDetail } from "@/components/shared/quote-detail";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string; quoteId: string }>;
}) {
  const { id, quoteId } = await params;

  return <QuoteDetail jobId={id} quoteId={quoteId} canHire />;
}
