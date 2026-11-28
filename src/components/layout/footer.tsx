import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const groups = [
  {
    title: "Categories",
    links: [
      { href: "/browse-pros?q=Plumbing", label: "Plumbing" },
      { href: "/browse-pros?q=Electrical", label: "Electrical" },
      { href: "/browse-pros?q=Cleaning", label: "House Cleaning" },
      { href: "/browse-pros?q=Chef", label: "Chefs & Cooks" },
      { href: "/browse-pros?q=Driver", label: "Drivers" },
      { href: "/browse-pros?q=Nanny", label: "Nannies & Caregivers" },
      { href: "/browse-pros?q=Security", label: "Security Personnel" },
      { href: "/browse-pros?q=Web", label: "Web Development" },
      { href: "/browse-pros?q=Design", label: "Graphic Design" },
    ],
  },
  {
    title: "For Clients",
    links: [
      { href: "/browse-pros", label: "Find a Pro" },
      { href: "/account/post-job", label: "Post a Job" },
      { href: "/services", label: "All Services" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing & Fees" },
      { href: "/faq", label: "Help & FAQ" },
    ],
  },
  {
    title: "For Professionals",
    links: [
      { href: "/pro-register", label: "Become a Pro" },
      { href: "/pro/jobs", label: "Available Jobs Board" },
      { href: "/pro/pricing", label: "Pro Membership" },
      { href: "/pro", label: "Professional Portal" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Nutsumo" },
      { href: "/contact", label: "Contact Us" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

const socials = [
  {
    href: "https://www.facebook.com/nutsumo",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.361H7.332v3.209h2.753v8.196h3.312z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/nutsumo",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/nutsumo",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/nutsumo",
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-title">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.25fr_repeat(4,1fr)] lg:px-8">
        <div>
          <Logo size="lg" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-copy">
            The trusted marketplace for skilled workers and professionals in Ghana. Compare quotes, chat privately and pay safely through escrow.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="font-display text-base font-semibold text-title">{group.title}</p>
            <ul className="mt-5 space-y-3 text-[15px] text-copy">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-title hover:underline underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-copy">
            <span>© {new Date().getFullYear()} Nutsumo Inc.</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <span className="text-sm font-medium text-copy">Ghana · GH₵ GHS</span>
            <div className="flex gap-1.5">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full text-copy transition-colors hover:bg-slate-100 hover:text-primary"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
