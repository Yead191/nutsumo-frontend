/**
 * Curated Unsplash photography for marketing pages. Every id here was checked
 * visually; keep new additions on-topic (the photo must show the actual trade).
 * Unsplash license: free for commercial use, no attribution required.
 */
export const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const stock = {
  // Trades & home
  cleaner: unsplash("photo-1581578731548-c64695cc6952"),
  vacuum: unsplash("photo-1527515637462-cff94eecc1ac"),
  sprayCleaning: unsplash("photo-1628177142898-93e36e4e3a50"),
  electrician: unsplash("photo-1621905251189-08b45d6a269e"),
  electricianPortrait: unsplash("photo-1621905252507-b35492cc74b4"),
  carpenter: unsplash("photo-1589939705384-5185137a7f0f"),
  constructionSite: unsplash("photo-1504307651254-35680f356dfd"),
  constructionTeam: unsplash("photo-1541888946425-d81bb19240f5"),
  architectPlans: unsplash("photo-1503387762-592deb58ef4e"),
  roofer: unsplash("photo-1632759145351-1d592919f522"),
  paintRoller: unsplash("photo-1562259949-e8e7689d7828"),
  pipes: unsplash("photo-1607472586893-edb57bdc0e39"),
  gardening: unsplash("photo-1416879595882-3373a0480b5b"),
  lawn: unsplash("photo-1558904541-efa843a96f01"),
  tiles: unsplash("photo-1523413651479-597eb2da0ad6"),
  mechanic: unsplash("photo-1487754180451-c456f719a1fc"),
  tools: unsplash("photo-1530124566582-a618bc2615dc"),
  deviceRepair: unsplash("photo-1581092918056-0c4c3acd3789"),

  // Homes & interiors
  modernHouse: unsplash("photo-1600585154340-be6161a56a0c"),
  poolHouse: unsplash("photo-1600596542815-ffad4c1539a9"),
  villa: unsplash("photo-1512917774080-9991f1c4c750"),
  livingRoom: unsplash("photo-1600607687939-ce8a6c25118c"),
  cosyLounge: unsplash("photo-1556228453-efd6c1ff04f6"),
  kitchen: unsplash("photo-1484154218962-a197022b5858"),
  kitchenBright: unsplash("photo-1556911220-bff31c812dba"),
  bathroom: unsplash("photo-1584622650111-993a426fbf0a"),

  // Domestic, food & lifestyle
  chef: unsplash("photo-1577219491135-ce391730fb2c"),
  homeCooking: unsplash("photo-1556910103-1c02745aae4d"),
  driver: unsplash("photo-1449965408869-eaa3f722e40d"),
  rideDriver: unsplash("photo-1600320254374-ce2d293c324e"),
  delivery: unsplash("photo-1526367790999-0150786686a2"),
  family: unsplash("photo-1609220136736-443140cffec6"),
  classroom: unsplash("photo-1509062522246-3755977927d7"),
  barber: unsplash("photo-1503951914875-452162b0f3f1"),
  fitness: unsplash("photo-1517836357463-d25dfeac3438"),
  eventTable: unsplash("photo-1511795409834-ef04bbd61622"),
  concert: unsplash("photo-1492684223066-81342ee5ff30"),

  // Office, tech & creative
  techTeam: unsplash("photo-1531482615713-2afd69097998"),
  dataCenter: unsplash("photo-1573164713988-8665fc963095"),
  codeLaptop: unsplash("photo-1498050108023-c5249f4df085"),
  codeScreen: unsplash("photo-1461749280684-dccba630e2f6"),
  analytics: unsplash("photo-1460925895917-afdab827c52f"),
  designPalette: unsplash("photo-1561070791-2526d30994b5"),
  designTools: unsplash("photo-1626785774573-4b799315345d"),
  officeHighFive: unsplash("photo-1600880292203-757bb62b4baf"),
  teamHands: unsplash("photo-1600880292089-90a7e086ee0c"),
  meeting: unsplash("photo-1556761175-5973dc0f32e7"),
  womenMeeting: unsplash("photo-1551836022-d5d88e9218df"),
  consultation: unsplash("photo-1573497620053-ea5300f94f21"),
  handshake: unsplash("photo-1521791136064-7986c2920216"),
  signing: unsplash("photo-1450101499163-c8848c66ca85"),
  finance: unsplash("photo-1554224155-6726b3ff858f"),
  legal: unsplash("photo-1589829545856-d10d557cf95f"),
  laptopWork: unsplash("photo-1515378791036-0648a3ef77b2"),
  cardPayment: unsplash("photo-1563013544-824ae1b704d3"),
  checkout: unsplash("photo-1556742049-0cfed4f6a45d"),

  // People
  portraitMan: unsplash("photo-1531384441138-2736e62e0919", 600),
  portraitWoman: unsplash("photo-1611432579699-484f7990b127", 600),
  portraitManSmile: unsplash("photo-1522529599102-193c0d76b5b6", 600),
  portraitManLaugh: unsplash("photo-1506277886164-e25aa3f4ef7f", 600),
  portraitWomanGlasses: unsplash("photo-1573497161161-c3e73707e25c", 600),
} as const;

/** Ordered: first match wins, so specific phrases come before broad ones. */
const CATEGORY_PHOTO_RULES: Array<[RegExp, string]> = [
  [/plumb|pipe/, "/images/services/plumbing.jpg"],
  [/electr|wiring/, "/images/services/electrical.jpg"],
  [/hvac|air ?con|cooling|heating/, "/images/services/hvac.jpg"],
  [/landscap|garden|lawn/, "/images/services/landscaping.jpg"],
  [/appliance|fridge|washing/, "/images/services/appliance-repair.jpg"],
  [/pest|fumigat/, "/images/services/pest-control.jpg"],
  [/handyman/, "/images/services/handyman.jpg"],
  [/paint/, "/images/services/painting.jpg"],
  [/\bauto|\bcar\b|vehicle|\btire|\btow|motorcycle|bicycle/, stock.mechanic],
  [/\broof/, stock.roofer],
  [/architect|draft|civil|structural|engineer(?!.*software)|inspection/, stock.architectPlans],
  [/demolition|excavat/, stock.constructionSite],
  [/cabinet|countertop/, stock.kitchenBright],
  [/tree|snow|junk/, stock.gardening],
  [/tutor|lesson|test prep|tech training|teach|academic|educat/, stock.classroom],
  [/sales|lead gen|public relations|customer support|human resource|recruit|project manag|real estate|insurance|facility|transcri|data entry/, stock.meeting],
  [/errand|personal assist/, stock.delivery],
  [/clean|housekeep|laundry/, stock.cleaner],
  [/carpent|wood|furniture/, stock.carpenter],
  [/mason|tile|floor/, stock.tiles],
  [/kitchen|bathroom|remodel|renovat/, stock.kitchen],
  [/interior/, stock.livingRoom],
  [/construct|contract|concrete|drywall|plaster|weld|fenc/, stock.constructionTeam],
  [/window|door/, stock.modernHouse],
  [/\bai\b|machine learning|data|analytic/, stock.analytics],
  [/cyber|information security|devops|cloud/, stock.dataCenter],
  [/it support|network|computer|laptop|phone|tablet|cctv|printer/, stock.deviceRepair],
  [/software|mobile app|web|e-?commerce|testing|quality assurance|game dev|blockchain/, stock.codeLaptop],
  [/\bui\b|\bux\b|design|graphic|illustrat|anim|3d/, stock.designTools],
  [/market|seo|social media|content|writ|copy|translat|proofread/, stock.laptopWork],
  [/account|bookkeep|financ|tax/, stock.finance],
  [/legal|law/, stock.legal],
  [/office|admin|virtual assist|secretar|consult|\bhr\b/, stock.womenMeeting],
  [/chef|cook|cater/, stock.chef],
  [/nann|child|babysit|elder|caregiv|care ?giver|domestic/, stock.family],
  [/tutor|teach|educat/, stock.classroom],
  [/driv|chauffeur/, stock.rideDriver],
  [/deliver|moving|mover|logistic/, stock.delivery],
  [/mechanic|auto|vehicle|car repair/, stock.mechanic],
  [/hair|barber|beauty|salon|makeup/, stock.barber],
  [/fitness|trainer|gym/, stock.fitness],
  [/wedding|event|party|\bdj\b/, stock.eventTable],
  [/photo|video|music|audio/, stock.concert],
  [/repair|technic|maintenance/, stock.tools],
];

/**
 * Several on-topic photos per trade so a page full of services from one
 * category doesn't repeat the same shot. Keyed by the photo categoryPhoto() picks.
 */
const PHOTO_POOLS: Record<string, string[]> = {
  "/images/services/plumbing.jpg": [
    "/images/services/plumbing.jpg",
    stock.pipes,
    unsplash("photo-1585704032915-c3400ca199e7"),
    stock.bathroom,
  ],
  "/images/services/electrical.jpg": [
    "/images/services/electrical.jpg",
    stock.electrician,
    stock.electricianPortrait,
    unsplash("photo-1621905251918-48416bd8575a"),
  ],
  "/images/services/painting.jpg": ["/images/services/painting.jpg", stock.paintRoller],
  "/images/services/landscaping.jpg": ["/images/services/landscaping.jpg", stock.lawn, stock.gardening],
  "/images/services/handyman.jpg": ["/images/services/handyman.jpg", stock.tools, stock.carpenter],
  [stock.cleaner]: [stock.cleaner, stock.vacuum, stock.sprayCleaning, unsplash("photo-1563453392212-326f5e854473")],
  [stock.carpenter]: [stock.carpenter, "/images/services/handyman.jpg", stock.tools],
  [stock.roofer]: [stock.roofer, "/images/services/roofing.jpg"],
  [stock.kitchen]: [stock.kitchen, stock.kitchenBright, stock.bathroom],
  [stock.livingRoom]: [stock.livingRoom, stock.cosyLounge],
  [stock.constructionTeam]: [stock.constructionTeam, stock.constructionSite, stock.architectPlans],
  [stock.codeLaptop]: [stock.codeLaptop, stock.codeScreen, stock.techTeam],
  [stock.analytics]: [stock.analytics, stock.codeScreen, stock.dataCenter],
  [stock.designTools]: [stock.designTools, stock.designPalette],
  [stock.laptopWork]: [stock.laptopWork, stock.analytics],
  [stock.meeting]: [stock.meeting, stock.womenMeeting, stock.consultation, stock.officeHighFive],
  [stock.womenMeeting]: [stock.womenMeeting, stock.meeting, stock.consultation],
  [stock.chef]: [stock.chef, stock.homeCooking],
  [stock.rideDriver]: [stock.rideDriver, stock.driver],
  [stock.mechanic]: [stock.mechanic, stock.tools],
  [stock.eventTable]: [stock.eventTable, stock.concert],
};

/**
 * Photo for one item in a list of a category's services: uses the item's
 * index to rotate through that trade's pool, so neighbours differ.
 */
export function rotatingCategoryPhoto(
  index: number,
  ...texts: Array<string | undefined | null>
): string | null {
  const base = categoryPhoto(...texts);
  if (!base) return null;
  const pool = PHOTO_POOLS[base] ?? [base];
  return pool[index % pool.length];
}

/** Picks an on-topic photo for a category/service name, or null if none fits. */
export function categoryPhoto(...texts: Array<string | undefined | null>): string | null {
  const q = texts.filter(Boolean).join(" ").replace(/-/g, " ").toLowerCase();
  return CATEGORY_PHOTO_RULES.find(([pattern]) => pattern.test(q))?.[1] ?? null;
}
