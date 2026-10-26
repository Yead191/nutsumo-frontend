/**
 * Trade-correct photography only.
 * Do not reuse plumbing/electrician hero shots for HVAC, painting, etc.
 */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const p = (id: string, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const photos = {
  hero: u("photo-1618221195710-dd6b41faaea6", 2200),
  heroInset: u("photo-1585704032915-c3400ca199e7", 900),
  trust: u("photo-1504328345606-18bbc8c9d7d1", 1400),
  trustAlt: u("photo-1581578731548-c64695cc6952", 900),
  cta: u("photo-1558618666-fcd25c85cd64", 2000),
  banner: u("photo-1504328345606-18bbc8c9d7d1", 1800),
  auth: u("photo-1621905252507-b35492cc74b4", 2200),
  banners: {
    pros: u("photo-1621905252472-943afaa20e20", 1800),
    how: u("photo-1585704032915-c3400ca199e7", 1800),
    jobs: u("photo-1556911220-bff31c812dba", 1800),
    pricing: u("photo-1503387762-592deb58ef4e", 1800),
    contact: u("photo-1581578731548-c64695cc6952", 1800),
    about: "/images/about/banner.jpg",
    legal: u("photo-1504328345606-18bbc8c9d7d1", 1800),
  },
  /** Cover / card image per trade — must match the craft visually */
  services: {
    "appliance-repair": "/images/services/appliance-repair.jpg",
    electrical: "/images/services/electrical.jpg",
    hvac: "/images/services/hvac.jpg",
    handyman: "/images/services/handyman.jpg",
    landscaping: "/images/services/landscaping.jpg",
    painting: "/images/services/painting.jpg",
    "pest-control": "/images/services/pest-control.jpg",
    plumbing: "/images/services/plumbing.jpg",
    roofing: "/images/services/roofing.jpg",
    "house-cleaning": u("photo-1581578731548-c64695cc6952", 1600),
  } as Record<string, string>,
  /** Extra portfolio shots — kept trade-pure */
  portfolio: {
    plumbing: [
      u("photo-1585704032915-c3400ca199e7", 1200),
      u("photo-1607472586893-edb57bdc0e39", 1200),
      p("1216589", 1200),
      u("photo-1542013936693-884638332954", 1200),
      p("6474471", 1200),
      u("photo-1507652313519-d4e9174996dd", 1200),
    ],
    electrical: [
      u("photo-1558618666-fcd25c85cd64", 1200),
      p("257736", 1200),
      u("photo-1621905252472-943afaa20e20", 1200),
      u("photo-1544717305-2782549b5136", 1200),
      u("photo-1513694203232-719a280e022f", 1200),
      u("photo-1558494949-ef010cbdcc31", 1200),
    ],
    hvac: [
      p("5463587", 1200),
      p("5463576", 1200),
      u("photo-1568634699096-82c9765548a0", 1200),
      u("photo-1621905251189-08b45d6a269e", 1200),
      u("photo-1581092160607-ee22621dd758", 1200),
    ],
    painting: [
      u("photo-1589939705384-5185137a7f0f", 1200),
      p("1669754", 1200),
      p("6474481", 1200),
      u("photo-1562259949-e8e7689d7828", 1200),
      u("photo-1595428774223-ef52624120d2", 1200),
    ],
    handyman: [
      u("photo-1581578731548-c64695cc6952", 1200),
      p("1249611", 1200),
      u("photo-1505798577917-a65157d3320a", 1200),
      u("photo-1581244277943-fe4a9c777189", 1200),
    ],
    landscaping: [
      u("photo-1416879595882-3373a0480b5b", 1200),
      p("1301856", 1200),
      u("photo-1558904541-efa8c4a08931", 1200),
      u("photo-1592417817098-8f3d69104a49", 1200),
    ],
    roofing: [
      u("photo-1632759145351-1d592919f522", 1200),
      p("221024", 1200),
      u("photo-1600585154340-be6161a56a0c", 1200),
    ],
    "appliance-repair": [
      p("4391470", 1200),
      p("4108715", 1200),
      u("photo-1584622650111-993a426fbf0a", 1200),
    ],
    "pest-control": [
      u("photo-1584622650111-993a426fbf0a", 1200),
      u("photo-1585704032915-c3400ca199e7", 1200),
    ],
  } as Record<string, string[]>,
};
