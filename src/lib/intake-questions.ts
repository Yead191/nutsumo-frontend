export interface IntakeChoice {
  value: string;
  label: string;
}

export interface IntakeQuestion {
  id: string;
  prompt: string;
  options: IntakeChoice[];
}

const sharedWhen: IntakeQuestion = {
  id: "when",
  prompt: "When do you need this done?",
  options: [
    { value: "asap", label: "As soon as possible" },
    { value: "this_week", label: "This week" },
    { value: "flexible", label: "I'm flexible" },
  ],
};

const byCategory: Record<string, IntakeQuestion[]> = {
  "house-cleaning": [
    {
      id: "clean_type",
      prompt: "What kind of clean do you need?",
      options: [
        { value: "standard", label: "Standard clean" },
        { value: "deep", label: "Deep clean" },
        { value: "move", label: "Move-in / move-out" },
      ],
    },
    {
      id: "bedrooms",
      prompt: "How many bedrooms?",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4+", label: "4+" },
      ],
    },
    {
      id: "bathrooms",
      prompt: "How many bathrooms?",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3+", label: "3+" },
      ],
    },
    {
      id: "frequency",
      prompt: "How often?",
      options: [
        { value: "once", label: "One-time" },
        { value: "weekly", label: "Weekly" },
        { value: "biweekly", label: "Every 2 weeks" },
        { value: "monthly", label: "Monthly" },
      ],
    },
    {
      id: "pets",
      prompt: "Any pets?",
      options: [
        { value: "none", label: "No" },
        { value: "dog", label: "Dog" },
        { value: "cat", label: "Cat" },
        { value: "both", label: "Both" },
      ],
    },
    sharedWhen,
  ],
  plumbing: [
    {
      id: "issue",
      prompt: "What's the plumbing issue?",
      options: [
        { value: "leak", label: "Leak" },
        { value: "clog", label: "Clog / drain" },
        { value: "fixture", label: "Faucet or toilet" },
        { value: "heater", label: "Water heater" },
        { value: "other", label: "Something else" },
      ],
    },
    {
      id: "where",
      prompt: "Where is it?",
      options: [
        { value: "kitchen", label: "Kitchen" },
        { value: "bath", label: "Bathroom" },
        { value: "laundry", label: "Laundry" },
        { value: "outside", label: "Outside" },
      ],
    },
    {
      id: "water",
      prompt: "Is water still running?",
      options: [
        { value: "yes", label: "Yes, it's leaking now" },
        { value: "drip", label: "Slow drip" },
        { value: "no", label: "Not leaking right now" },
      ],
    },
    sharedWhen,
  ],
  electrical: [
    {
      id: "issue",
      prompt: "What electrical work do you need?",
      options: [
        { value: "outlet", label: "Outlet or switch" },
        { value: "lights", label: "Lights" },
        { value: "breaker", label: "Breaker / no power" },
        { value: "install", label: "New install" },
      ],
    },
    {
      id: "count",
      prompt: "How many spots?",
      options: [
        { value: "1", label: "1" },
        { value: "2-3", label: "2–3" },
        { value: "4+", label: "4 or more" },
      ],
    },
    {
      id: "power",
      prompt: "Is power still on in the rest of the home?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "partial", label: "Some rooms are out" },
        { value: "no", label: "No" },
      ],
    },
    sharedWhen,
  ],
  hvac: [
    {
      id: "system",
      prompt: "What needs work?",
      options: [
        { value: "ac", label: "Air conditioning" },
        { value: "heat", label: "Heating" },
        { value: "both", label: "Both" },
      ],
    },
    {
      id: "issue",
      prompt: "What's happening?",
      options: [
        { value: "none", label: "Not working" },
        { value: "weak", label: "Weak airflow" },
        { value: "noise", label: "Noisy" },
        { value: "maintain", label: "Tune-up" },
      ],
    },
    sharedWhen,
  ],
  painting: [
    {
      id: "area",
      prompt: "What are you painting?",
      options: [
        { value: "interior", label: "Interior" },
        { value: "exterior", label: "Exterior" },
        { value: "both", label: "Both" },
      ],
    },
    {
      id: "size",
      prompt: "How much space?",
      options: [
        { value: "1", label: "1 room" },
        { value: "2-3", label: "2–3 rooms" },
        { value: "whole", label: "Whole home" },
      ],
    },
    {
      id: "paint",
      prompt: "Do you have the paint?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "Need the pro to supply it" },
      ],
    },
    sharedWhen,
  ],
  handyman: [
    {
      id: "job",
      prompt: "What kind of job is this?",
      options: [
        { value: "mount", label: "Mount or hang" },
        { value: "repair", label: "Repair" },
        { value: "assemble", label: "Assemble" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "size",
      prompt: "How big is the job?",
      options: [
        { value: "small", label: "Under 2 hours" },
        { value: "half", label: "Half day" },
        { value: "full", label: "Full day" },
      ],
    },
    sharedWhen,
  ],
  landscaping: [
    {
      id: "job",
      prompt: "What outdoor work do you need?",
      options: [
        { value: "mow", label: "Mow / clean-up" },
        { value: "tree", label: "Trees or shrubs" },
        { value: "hard", label: "Patio or beds" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "lot",
      prompt: "About how large is the yard?",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    },
    sharedWhen,
  ],
  "pest-control": [
    {
      id: "pest",
      prompt: "What are you dealing with?",
      options: [
        { value: "ants", label: "Ants" },
        { value: "roaches", label: "Roaches" },
        { value: "rodents", label: "Rodents" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "where",
      prompt: "Where have you seen them?",
      options: [
        { value: "inside", label: "Inside" },
        { value: "outside", label: "Outside" },
        { value: "both", label: "Both" },
      ],
    },
    sharedWhen,
  ],
  roofing: [
    {
      id: "job",
      prompt: "What roof work do you need?",
      options: [
        { value: "leak", label: "Leak repair" },
        { value: "inspect", label: "Inspection" },
        { value: "replace", label: "Replacement" },
        { value: "gutter", label: "Gutters" },
      ],
    },
    {
      id: "stories",
      prompt: "How many stories?",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3+", label: "3+" },
      ],
    },
    sharedWhen,
  ],
  "appliance-repair": [
    {
      id: "appliance",
      prompt: "Which appliance?",
      options: [
        { value: "fridge", label: "Refrigerator" },
        { value: "washer", label: "Washer / dryer" },
        { value: "dishwasher", label: "Dishwasher" },
        { value: "oven", label: "Oven / stove" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "issue",
      prompt: "What's wrong?",
      options: [
        { value: "dead", label: "Won't turn on" },
        { value: "leak", label: "Leaking" },
        { value: "noise", label: "Noise or error" },
        { value: "other", label: "Something else" },
      ],
    },
    sharedWhen,
  ],
};

const fallback: IntakeQuestion[] = [
  {
    id: "job",
    prompt: "What do you need help with?",
    options: [
      { value: "repair", label: "Repair" },
      { value: "install", label: "Install" },
      { value: "inspect", label: "Inspect" },
    ],
  },
  sharedWhen,
];

export function questionsForCategory(slug: string): IntakeQuestion[] {
  return byCategory[slug] ?? fallback;
}

export function labelForAnswer(slug: string, questionId: string, value: string) {
  const question = questionsForCategory(slug).find((item) => item.id === questionId);
  return question?.options.find((option) => option.value === value)?.label ?? value;
}
