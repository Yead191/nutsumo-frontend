import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "white" | "onDark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover hover:text-white shadow-xs hover:shadow-sm",
  secondary: "bg-secondary text-white hover:bg-primary hover:text-white shadow-xs hover:shadow-sm",
  ghost: "border border-line bg-transparent text-title hover:border-primary hover:text-primary hover:bg-smoke/60",
  white: "bg-white text-title hover:bg-smoke hover:text-title shadow-xs hover:shadow-sm",
  onDark: "border border-white bg-transparent !text-white hover:bg-white hover:!text-title",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-5 text-sm",
  md: "min-h-[50px] px-8 text-base",
  lg: "min-h-14 px-9 text-lg tracking-wide",
};

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = Common &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = Common &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common | "href"> & {
    href: string;
    type?: never;
  };

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-display font-medium tracking-tight transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
