import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
  descriptionClassName,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
  descriptionClassName?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-4xl text-center", className)}>
      {eyebrow ? (
        <div className={cn("mb-3 sm:mb-3.5", align === "center" && "flex justify-center")}>
          <div
            className={cn(
              "inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight",
              light ? "text-white/90" : "text-title",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px]",
                light ? "border-white" : "border-primary",
              )}
            />
            <span>{eyebrow}</span>
          </div>
        </div>
      ) : null}
      <h2
        className={cn(
          "font-geist text-[32px] sm:text-[40px] md:text-[48px] font-medium leading-[1.125] tracking-[-0.05em] sm:tracking-[-0.06em]",
          light ? "!text-white" : "!text-black",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3.5 sm:mt-4 max-w-[640px] font-['Inter_Display',Inter,sans-serif] text-[16px] sm:text-[18px] font-normal leading-[26px] tracking-[-0.18px]",
            light ? "!text-white/80" : "text-[#757575]",
            align === "center" && "mx-auto",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}