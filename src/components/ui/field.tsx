import { cn } from "@/lib/cn";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="block font-display text-sm font-semibold text-title">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

const controlClass =
  "w-full min-h-[50px] rounded-[10px] border border-line bg-white px-4 text-[16px] text-title outline-none transition-colors placeholder:text-[14px] placeholder:text-muted focus:border-primary";

export function TextField(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={cn(controlClass, props.className)} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={cn(controlClass, "min-h-32 resize-y py-3", props.className)}
    />
  );
}

export function NativeSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return <select {...props} className={cn(controlClass, props.className)} />;
}
