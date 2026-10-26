import { cn } from "@/lib/cn";
import type { User } from "@/types";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserAvatar({
  user,
  size = "md",
}: {
  user: Pick<User, "name" | "avatar">;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-16 w-16 text-lg",
  };

  if (user.avatar) {
    return (
      <span className={cn("relative block overflow-hidden rounded-full bg-smoke", sizes[size])}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.avatar} alt="" className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "grid place-items-center rounded-full bg-primary font-display font-bold text-white",
        sizes[size],
      )}
    >
      {initials(user.name)}
    </span>
  );
}
