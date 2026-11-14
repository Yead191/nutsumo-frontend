export type QuoteViewer = {
  id: string;
  role: string;
  name?: string;
};

export function toQuoteViewer(
  user: { _id?: string; id?: string; role?: string; name?: string } | null | undefined,
): QuoteViewer | null {
  const id = user?._id || user?.id;
  if (!id) return null;
  return {
    id: String(id),
    role: user?.role || "USER",
    name: user?.name,
  };
}
