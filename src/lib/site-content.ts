export const homeownerFaqs = [
  {
    q: "Do I need an account to browse contractors?",
    a: "No. You can freely explore verified local contractor profiles, read authentic customer reviews, and check past project photos without creating an account. You only need a free account when you're ready to post a job and receive competitive bids.",
  },
  {
    q: "Is it free to get quotes, and am I obligated to hire?",
    a: "Getting quotes is 100% free with zero obligation. You can post your repair request, compare itemized quotes side-by-side from background-checked local specialists, and only hire if you find a pro that matches your budget and schedule.",
  },
  {
    q: "Are contractors licensed, insured, and background-checked?",
    a: "Yes. Trade specialists (electricians, plumbers, HVAC technicians) must hold active state trade licenses and commercial liability insurance. All independent pros pass identity verification and criminal background screening before joining.",
  },
  {
    q: "How do payments work?",
    a: "You agree on the price and pay your contractor directly after the job is completed to your satisfaction—via credit card, check, cash, or digital transfer. LocalHomeFix never holds your funds or charges middleman checkout surcharges.",
  },
  {
    q: "What happens if I'm not satisfied or an issue arises?",
    a: "Contractors provide clear itemized scopes and standard workmanship warranties on their repairs. If questions or discrepancies occur, our customer support team is available to help mediate and ensure a fair resolution.",
  },
  {
    q: "Can I get same-day or emergency repair services?",
    a: "Yes. Many of our local pros offer emergency callouts for burst pipes, electrical shorts, and sudden AC failures. When posting your request, simply select 'Urgent / ASAP' to notify on-duty technicians immediately.",
  },
  {
    q: "How quickly do contractors respond to requests?",
    a: "Most standard repair requests receive their first 2 to 3 itemized quotes within 15 to 45 minutes during normal business hours.",
  },
  {
    q: "What if I'm not sure which trade to pick?",
    a: "Use our 'Describe Issue' tool on the homepage. Just explain what you see, hear, or smell in everyday words, and our system will route it to the right licensed trade (or a trusted handyman).",
  },
];

export const proFaqs = [
  {
    q: "How much does it cost for contractors to join?",
    a: "We offer a 3-month completely free trial with full directory listing and unlimited quoting. Afterward, membership is a flat $19.99/month (or $14.99/month billed annually). We charge 0% commission on your jobs and never charge per-lead fees.",
  },
  {
    q: "Do you take a cut of my earnings or charge for leads?",
    a: "Never. Unlike Angi, Thumbtack, or Yelp that sell expensive, shared leads to 4+ pros or take a 15–25% cut of every project, LocalHomeFix operates on a transparent, flat monthly subscription. You keep 100% of every dollar you charge.",
  },
  {
    q: "Do you sell the same lead to multiple contractors?",
    a: "No. Homeowners either book you directly from your verified public profile or post an open repair request where verified pros submit transparent quotes. We never engage in pay-per-lead bidding wars or charge you to contact a client.",
  },
  {
    q: "How do I receive leads and job notifications?",
    a: "Once cleared, you receive instant SMS and email notifications whenever a homeowner in your designated Austin service radius posts a request in your trade. You can inspect project photos, descriptions, and urgency before submitting an itemized bid.",
  },
  {
    q: "What documents are required to clear compliance verification?",
    a: "Trade pros must submit proof of relevant state or municipal trade licensing (TDLR license for plumbing, electrical, and HVAC) and a Certificate of Insurance (COI) showing at least $1,000,000 in general liability coverage. Identity is verified via hosted Stripe screening.",
  },
  {
    q: "How quickly is my contractor application audited and approved?",
    a: "Our compliance team audits submitted licenses against Texas state licensing registries within 24 business hours. Automated license status checks run regularly to maintain your Verified Pro badge.",
  },
  {
    q: "How and when do homeowners pay me?",
    a: "Homeowners pay you directly upon job completion using your preferred payment methods (cash, check, card, or direct transfer). LocalHomeFix never withholds your funds or charges checkout processing surcharges.",
  },
  {
    q: "Can I pause or cancel my membership anytime?",
    a: "Yes. There are no lock-in contracts or cancellation penalties. You can pause or cancel your subscription at any time with one click from your Pro Dashboard settings.",
  },
];

export const faqs = homeownerFaqs;

export type PlanFeature = {
  text: string;
  icon: string;
};

export type PlanItem = {
  id: "homeowner" | "pro" | "pro-annual";
  name: string;
  badge?: string;
  price: string;
  period: string;
  tagline: string;
  href: string;
  cta: string;
  featured: boolean;
  features: PlanFeature[];
};

export const plans: PlanItem[] = [
  {
    id: "homeowner",
    name: "Homeowners",
    badge: "100% Free Forever",
    price: "$0",
    period: "/forever",
    tagline: "Always 100% free for homeowners. Zero commissions, zero fees.",
    href: "/login?next=%2Faccount%2Fpost-job",
    cta: "Post a request ↗",
    featured: false,
    features: [
      { text: "100% free — zero commissions or service fees", icon: "shield" },
      { text: "Post unlimited repair requests for $0", icon: "clipboard" },
      { text: "Browse verified local contractor profiles", icon: "search" },
      { text: "Compare itemized quotes side-by-side", icon: "layers" },
      { text: "Pay contractor directly with zero markup", icon: "check" },
    ],
  },
  {
    id: "pro",
    name: "Pro Monthly",
    badge: "🔥 Popular",
    price: "$19.99",
    period: "/per month",
    tagline: "Flat subscription for pros. First 3 months free. Cancel anytime.",
    href: "/pro-register",
    cta: "Start 3 months free ↗",
    featured: true,
    features: [
      { text: "Keep 100% of your earnings ($0 job cut)", icon: "percent" },
      { text: "Quote unlimited local homeowner requests", icon: "briefcase" },
      { text: "Verified Pro badge on pro listings", icon: "shield" },
      { text: "Direct homeowner chat & scheduling", icon: "message" },
      { text: "Zero bidding fees or pay-per-lead costs", icon: "zap" },
    ],
  },
  {
    id: "pro-annual",
    name: "Pro Annual",
    badge: "Save 25%",
    price: "$14.99",
    period: "/per month",
    tagline: "Flat annual pro subscription ($179/yr) after 3-month trial.",
    href: "/pro-register",
    cta: "Get started ↗",
    featured: false,
    features: [
      { text: "All Pro Monthly features included", icon: "check" },
      { text: "Priority search placement in pro search", icon: "award" },
      { text: "Featured contractor profile badge", icon: "badgeCheck" },
      { text: "Dedicated priority support line", icon: "phone" },
      { text: "Quarterly job request analytics", icon: "trending" },
    ],
  },
];

