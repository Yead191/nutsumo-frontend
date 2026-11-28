/**
 * Top-level groups for the Fiverr-style category tabs/menus. The backend only has
 * category → service, so categories are bucketed into groups by name here.
 * First match wins; anything unmatched lands in "More services".
 */
export const CATEGORY_GROUPS: Array<{ key: string; label: string; match: RegExp }> = [
  {
    key: "home",
    label: "Home Services",
    match: /clean|laundry|plumb|electric|hvac|handyman|landscap|garden|tree|appliance|pest|fumigat|solar|generator|locksmith|pool|\bspa\b|junk|pressure wash|snow|septic|sewer|mold|water treat|chimney|home security|smart home|furniture|upholster/,
  },
  {
    // Before construction so "Auto Body & Paint" isn't filed under painting.
    key: "auto",
    label: "Auto & Vehicles",
    match: /\bauto|\bcar\b|vehicle|mechanic(?!al)|\btire|\btow|motorcycle|bicycle/,
  },
  {
    // \broof: "proofreading" must not land here.
    key: "construction",
    label: "Construction & Renovation",
    match: /mason|tile|\broof|waterproof|carpent|wood|paint|floor|remodel|renovat|contract|window|door|drywall|plaster|fenc|gate|concrete|paving|interior|construct|weld|insulation|cabinet|countertop|glass|wallpaper|demolition|excavat|architect|draft|civil|structural|mechanical engineer|inspection/,
  },
  {
    // Before programming/design so "Coding & Tech Training" and "Music Lessons" land here.
    key: "lessons",
    label: "Lessons & Tutoring",
    match: /tutor|lesson|test prep|tech training|teach|academic|educat/,
  },
  {
    key: "programming",
    label: "Programming & Tech",
    match: /software|web|mobile app|devops|cloud|cyber|quality assurance|testing|e-?commerce|data science|database|data analy|\bai\b|machine learning|blockchain|game dev/,
  },
  {
    key: "repair",
    label: "Device Repair & IT",
    match: /computer|laptop|phone|tablet|it support|network|cctv|printer/,
  },
  {
    key: "design",
    label: "Design & Creative",
    match: /\bui\b|\bux\b|design|graphic|photo|video|anim|music|audio|illustrat|3d|model|render|voice|print|sign/,
  },
  {
    key: "marketing",
    label: "Writing & Marketing",
    match: /writ|content|translat|proofread|market|seo|search engine|social media|copy/,
  },
  {
    key: "business",
    label: "Business & Office",
    match: /office|admin|account|bookkeep|financ|\btax|virtual assist|secretar|legal|\bhr\b|human resource|recruit|consult|data entry|transcri|customer support|sales|lead gen|public relations|project manag|real estate|insurance|facility/,
  },
  {
    key: "domestic",
    label: "Domestic & Care",
    match: /nann|child|babysit|elder|caregiv|care ?giver|nursing|chef|cook|cater|housekeep|domestic|\bpet\b|\bdog|errand/,
  },
  {
    key: "wellness",
    label: "Health & Beauty",
    match: /massage|physio|counsel|therap|nutrition|diet|yoga|meditat|\bnail|skin|esthetic|beauty|hair|barber|makeup|fitness|personal train/,
  },
  {
    key: "driving",
    label: "Logistics & Security",
    match: /driv|chauffeur|courier|deliver|moving|mover|relocat|logistic|warehouse|freight|truck|secur|guard/,
  },
  {
    key: "lifestyle",
    label: "Events & Lifestyle",
    match: /event|wedding|\bdj\b|entertain|florist|tailor|alteration|shoe|leather|watch|jewel/,
  },
];

export const OTHER_GROUP = { key: "other", label: "More services" };

export interface CategoryGroup<T> {
  key: string;
  label: string;
  categories: T[];
}

/** Buckets categories into the groups above, dropping empty groups. */
export function groupCategories<T extends { name: string; slug?: string }>(
  categories: T[],
): CategoryGroup<T>[] {
  const buckets = new Map<string, T[]>();
  for (const category of categories) {
    const q = `${category.name} ${(category.slug || "").replace(/-/g, " ")}`.toLowerCase();
    const key = CATEGORY_GROUPS.find((group) => group.match.test(q))?.key ?? OTHER_GROUP.key;
    buckets.set(key, [...(buckets.get(key) || []), category]);
  }
  return [...CATEGORY_GROUPS, OTHER_GROUP]
    .map((group) => ({ key: group.key, label: group.label, categories: buckets.get(group.key) || [] }))
    .filter((group) => group.categories.length > 0);
}
