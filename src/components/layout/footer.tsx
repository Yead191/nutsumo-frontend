import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const groups = [
  {
    title: "Popular Services",
    links: [
      { href: "/browse-pros?category=plumbing", label: "Plumbing Repair" },
      { href: "/browse-pros?category=electrical", label: "Electrical" },
      { href: "/browse-pros?category=hvac", label: "HVAC & Cooling" },
      { href: "/browse-pros?category=handyman", label: "Handyman Services" },
      { href: "/browse-pros?category=painting", label: "Painting" },
    ],
  },
  {
    title: "For Homeowners",
    links: [
      { href: "/browse-pros", label: "Find a Pro" },
      { href: "/services", label: "All Services" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "For Contractors",
    links: [
      { href: "/pro-register", label: "Join Pro Network" },
      { href: "/pro/jobs", label: "Available Jobs Board" },
      { href: "/pro/pricing", label: "Pro Membership" },
      { href: "/pro", label: "Contractor Portal" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

const socials = [
  {
    href: "https://www.facebook.com/localhomefix",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.361H7.332v3.209h2.753v8.196h3.312z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/localhomefix",
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
    href: "https://www.linkedin.com/company/localhomefix",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/localhomefix",
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
    <footer className="bg-title text-white">
      <div className="container-site grid gap-10 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,0.7fr)]">
        <div>
          <Logo variant="dark" size="lg" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
            Your trusted local home repair network. Compare itemized quotes from background-checked local specialists, message privately, and pay directly upon job completion.
          </p>
          <div className="mt-6 flex gap-2">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-primary hover:bg-primary"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="font-display text-base font-semibold tracking-tight text-white">{group.title}</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-site py-5 text-center text-xs text-white/50">
        <p>© {new Date().getFullYear()} LocalHomeFix Inc.</p>
      </div>
    </footer>
  );
}
