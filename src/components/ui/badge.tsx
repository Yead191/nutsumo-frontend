import { cn } from "@/lib/cn";

type Tone = "blue" | "green" | "amber" | "slate" | "orange";

const tones: Record<Tone, string> = {
  blue: "bg-smoke text-primary",
  green: "bg-[#e8f7ec] text-success",
  amber: "bg-[#fff6d8] text-[#8a6d00]",
  slate: "bg-surface text-copy",
  orange: "bg-[#fff1de] text-[#9a5a00]",
};

export function Badge({
  children,
  tone = "blue",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 font-display text-xs font-medium tracking-tight",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
