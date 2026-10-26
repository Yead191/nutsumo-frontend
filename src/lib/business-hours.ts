export const WEEK_DAYS = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
] as const;

export type Weekday = (typeof WEEK_DAYS)[number]["key"];
export type HoursStatus = "open" | "closed";

export interface TimeSlot {
  open: string;
  close: string;
}

export interface DaySchedule {
  status: HoursStatus;
  slots: TimeSlot[];
}

export type WeeklyHours = Record<Weekday, DaySchedule>;

export const TIME_OPTIONS = buildTimeOptions();

function buildTimeOptions() {
  const options: string[] = [];
  for (let hour = 5; hour <= 23; hour += 1) {
    for (const minute of [0, 30]) {
      options.push(formatClock(hour, minute));
    }
  }
  return options;
}

function formatClock(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${minute.toString().padStart(2, "0")} ${period}`;
}

export function openDay(open = "8:00 AM", close = "6:00 PM"): DaySchedule {
  return { status: "open", slots: [{ open, close }] };
}

export function defaultWeeklyHours(): WeeklyHours {
  return WEEK_DAYS.reduce((hours, day) => {
    hours[day.key] = openDay();
    return hours;
  }, {} as WeeklyHours);
}

export function formatDayHours(day: DaySchedule) {
  if (day.status === "closed" || !day.slots?.length) return "Closed";
  return day.slots.map((slot) => `${slot.open} – ${slot.close}`).join(", ");
}

export function sameHours(a: DaySchedule, b: DaySchedule) {
  if (a.status !== b.status) return false;
  if (a.slots.length !== b.slots.length) return false;
  return a.slots.every(
    (slot, index) => slot.open === b.slots[index]?.open && slot.close === b.slots[index]?.close,
  );
}

export function allDaysMatch(hours: WeeklyHours) {
  return WEEK_DAYS.every((day) => sameHours(hours.monday, hours[day.key]));
}

export function groupWeeklyHours(hours: WeeklyHours) {
  const groups: { label: string; value: string; status: HoursStatus }[] = [];

  WEEK_DAYS.forEach((day, index) => {
    const current = hours[day.key];
    const previous = groups[groups.length - 1];
    const previousDay = WEEK_DAYS[index - 1];

    if (previous && previousDay && sameHours(hours[previousDay.key], current)) {
      const start = previous.label.split(" – ")[0];
      previous.label = `${start} – ${day.label}`;
      return;
    }

    groups.push({
      label: day.label,
      value: formatDayHours(current),
      status: current.status,
    });
  });

  return groups;
}

export function todayWeekday(): Weekday {
  const map: Weekday[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return map[new Date().getDay()] ?? "monday";
}

function cloneDay(day: DaySchedule): DaySchedule {
  return {
    status: day.status,
    slots: day.slots.map((slot) => ({ ...slot })),
  };
}

function fromLegacyRange(value: string | undefined, fallback: DaySchedule): DaySchedule {
  const text = (value ?? "").trim();
  if (!text || /closed|emergency/i.test(text)) return { status: "closed", slots: cloneDay(fallback).slots };
  const parts = text.split(/\s*[–-]\s*/);
  if (parts.length >= 2) {
    return { status: "open", slots: [{ open: parts[0].trim(), close: parts[1].trim() }] };
  }
  return cloneDay(fallback);
}

function fromUnknownDay(entry: unknown, fallback: DaySchedule): DaySchedule {
  if (!entry || typeof entry !== "object") return cloneDay(fallback);
  const raw = entry as {
    status?: string;
    open?: string;
    close?: string;
    slots?: TimeSlot[];
  };
  const closed = raw.status === "closed" || raw.status === "emergency";
  if (raw.slots?.length) {
    return {
      status: closed ? "closed" : "open",
      slots: raw.slots.map((slot) => ({
        open: slot.open || "8:00 AM",
        close: slot.close || "6:00 PM",
      })),
    };
  }
  if (raw.open && raw.close) {
    return {
      status: closed ? "closed" : "open",
      slots: [{ open: raw.open, close: raw.close }],
    };
  }
  return cloneDay(fallback);
}

function isWeeklyHours(value: unknown): value is Record<Weekday, unknown> {
  if (!value || typeof value !== "object") return false;
  return WEEK_DAYS.every((day) => Boolean((value as Record<string, unknown>)[day.key]));
}

export function normalizeWeeklyHours(raw: unknown): WeeklyHours {
  const fallback = defaultWeeklyHours();
  if (isWeeklyHours(raw)) {
    return WEEK_DAYS.reduce((hours, day) => {
      hours[day.key] = fromUnknownDay(raw[day.key], fallback[day.key]);
      return hours;
    }, {} as WeeklyHours);
  }

  if (raw && typeof raw === "object") {
    const legacy = raw as { weekdays?: string; saturday?: string; sunday?: string };
    if (legacy.weekdays || legacy.saturday || legacy.sunday) {
      const weekdays = fromLegacyRange(legacy.weekdays, fallback.monday);
      return {
        monday: cloneDay(weekdays),
        tuesday: cloneDay(weekdays),
        wednesday: cloneDay(weekdays),
        thursday: cloneDay(weekdays),
        friday: cloneDay(weekdays),
        saturday: fromLegacyRange(legacy.saturday, fallback.saturday),
        sunday: fromLegacyRange(legacy.sunday, fallback.sunday),
      };
    }
  }

  return fallback;
}

export function applyHoursToDays(source: DaySchedule, days: Weekday[], current: WeeklyHours): WeeklyHours {
  const next = { ...current };
  days.forEach((day) => {
    next[day] = cloneDay(source);
  });
  return next;
}
