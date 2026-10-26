import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  href,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  href?: string;
}) {
  return (
    <div className="rounded-[14px] border border-dashed border-line bg-smoke px-5 py-8 text-center">
      <h3 className="text-lg">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-5 text-copy">{description}</p>
      {actionLabel && href ? (
        <div className="mt-4">
          <Button href={href} size="sm">
            {actionLabel.endsWith("↗") || actionLabel.startsWith("←")
              ? actionLabel
              : `${actionLabel} ↗`}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
