import type { Professional } from "@/types";

/**
 * Coordinate lookup for Texas cities & ZIP codes used in LocalHomeFix
 */
export const LOCATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Austin Central / Downtown & Neighborhoods
  "78701": { lat: 30.2713, lng: -97.7426 }, // Downtown Austin
  "78702": { lat: 30.2625, lng: -97.7180 }, // East Austin
  "78703": { lat: 30.2917, lng: -97.7617 }, // Clarksville / Tarrytown
  "78704": { lat: 30.2449, lng: -97.7634 }, // South Congress / South Lamar
  "78745": { lat: 30.2078, lng: -97.7946 }, // South Austin
  "78750": { lat: 30.4206, lng: -97.8091 }, // Northwest Austin
  "78759": { lat: 30.4012, lng: -97.7479 }, // Arboretum / Great Hills

  // Greater Austin / Travis & Williamson County
  "78664": { lat: 30.5083, lng: -97.6789 }, // Round Rock East
  "78681": { lat: 30.5255, lng: -97.7314 }, // Round Rock West
  "78613": { lat: 30.5052, lng: -97.8203 }, // Cedar Park
  "78660": { lat: 30.4394, lng: -97.6200 }, // Pflugerville
  "78641": { lat: 30.5788, lng: -97.8558 }, // Leander
  "78626": { lat: 30.6333, lng: -97.6778 }, // Georgetown

  // Major Texas Metro Hubs
  "78205": { lat: 29.4241, lng: -98.4936 }, // San Antonio Downtown
  "75201": { lat: 32.7876, lng: -96.7995 }, // Dallas Downtown
  "75024": { lat: 33.0788, lng: -96.8194 }, // Plano
  "76102": { lat: 32.7555, lng: -97.3308 }, // Fort Worth Downtown
  "76010": { lat: 32.7357, lng: -97.1081 }, // Arlington
  "77002": { lat: 29.7589, lng: -95.3677 }, // Houston Downtown

  // City Name lookups
  austin: { lat: 30.2672, lng: -97.7431 },
  "round rock": { lat: 30.5083, lng: -97.6789 },
  "cedar park": { lat: 30.5052, lng: -97.8203 },
  pflugerville: { lat: 30.4394, lng: -97.6200 },
  georgetown: { lat: 30.6333, lng: -97.6778 },
  "san antonio": { lat: 29.4241, lng: -98.4936 },
  dallas: { lat: 32.7767, lng: -96.7970 },
  "fort worth": { lat: 32.7555, lng: -97.3308 },
  arlington: { lat: 32.7357, lng: -97.1081 },
  plano: { lat: 33.0198, lng: -96.6989 },
  houston: { lat: 29.7604, lng: -95.3698 },
};

/**
 * Calculates distance in miles using the Haversine formula
 */
export function calculateDistanceMiles(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): number {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = ((toLat - fromLat) * Math.PI) / 180;
  const dLng = ((toLng - fromLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((fromLat * Math.PI) / 180) *
      Math.cos((toLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

/**
 * Resolves coordinate for a given location string (zip code or city name)
 */
export function resolveCoordinates(locationStr?: string): { lat: number; lng: number } {
  if (!locationStr) {
    // Default to Austin center
    return LOCATION_COORDINATES["78701"];
  }

  const clean = locationStr.trim().toLowerCase();

  // 1. Direct zip match
  if (LOCATION_COORDINATES[clean]) {
    return LOCATION_COORDINATES[clean];
  }

  // 2. 5-digit zip extract
  const zipMatch = clean.match(/\b\d{5}\b/);
  if (zipMatch && LOCATION_COORDINATES[zipMatch[0]]) {
    return LOCATION_COORDINATES[zipMatch[0]];
  }

  // 3. City name match
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (isNaN(Number(key)) && clean.includes(key)) {
      return coords;
    }
  }

  // Fallback to Austin central
  return LOCATION_COORDINATES["78701"];
}

/**
 * Returns estimated distance in miles between a pro and the active search/user location
 */
export function getProDistance(
  pro: Professional,
  searchLocation?: string,
  userLocation?: { zip?: string; city?: string },
): number {
  const targetStr = searchLocation || userLocation?.zip || userLocation?.city || "Austin";
  const targetCoords = resolveCoordinates(targetStr);
  const proCoords = LOCATION_COORDINATES[pro.zip] || LOCATION_COORDINATES[pro.city.toLowerCase()] || resolveCoordinates(pro.city);

  return calculateDistanceMiles(
    targetCoords.lat,
    targetCoords.lng,
    proCoords.lat,
    proCoords.lng,
  );
}

/**
 * Converts pro response time string to hours for sorting
 */
export function parseResponseTimeHours(responseTime: string): number {
  const lower = responseTime.toLowerCase();
  if (lower.includes("min")) return 0.25;
  if (lower.includes("under 1 hour") || lower.includes("< 1 hour")) return 0.5;
  if (lower.includes("within 1 hour")) return 1;
  if (lower.includes("within 2 hours")) return 2;
  if (lower.includes("within 3 hours")) return 3;
  if (lower.includes("within 4 hours")) return 4;
  if (lower.includes("same day")) return 8;
  if (lower.includes("24 hours")) return 24;
  if (lower.includes("next business day")) return 36;
  if (lower.includes("2 days")) return 48;
  return 72;
}
