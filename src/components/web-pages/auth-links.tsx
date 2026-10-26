import Link from "next/link";
import { Fragment } from "react";

type AuthLink = { href: string; label: string };

export function AuthLinks({
  prompt,
  href,
  label,
  extras = [],
}: {
  prompt: string;
  href: string;
  label: string;
  extras?: AuthLink[];
}) {
  return (
    <div className="mt-7 border-t border-line/80 pt-6 text-center">
      <p className="text-sm text-copy">
        {prompt}{" "}
        <Link href={href} className="font-semibold text-primary">
          {label}
        </Link>
      </p>
      {extras.length ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm">
          {extras.map((item, index) => (
            <Fragment key={item.href}>
              {index > 0 ? <span className="text-muted">·</span> : null}
              <Link href={item.href} className="font-semibold text-primary">
                {item.label}
              </Link>
            </Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
}
