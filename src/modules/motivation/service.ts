export interface DailyMotivation {
  quote: string;
  reflection: string;
  focusLabel: string;
  colour: "teal" | "amber" | "sky" | "rose";
}

const dailyMotivationLibrary: DailyMotivation[] = [
  {
    quote: "Small progress still counts, especially on the days that feel slow.",
    reflection: "One calmer revision block, one reviewed mistake, or one restarted session still moves the learner forward.",
    focusLabel: "Keep the streak gentle",
    colour: "teal",
  },
  {
    quote: "You do not need a perfect session to have a useful one.",
    reflection: "The goal today is to learn one thing more clearly and leave with a better next step than before.",
    focusLabel: "Aim for useful, not perfect",
    colour: "amber",
  },
  {
    quote: "Confidence grows when the work becomes familiar, not when it becomes easy instantly.",
    reflection: "Coming back to the same topic with a little more understanding is already proof that the effort is working.",
    focusLabel: "Trust the repeat work",
    colour: "sky",
  },
  {
    quote: "A reset is not failure. It is part of finishing hard things well.",
    reflection: "If a learner had to pause, breathe, or begin again, the platform should help them continue without shame.",
    focusLabel: "Reset and continue",
    colour: "rose",
  },
  {
    quote: "One focused step today can make tomorrow feel much lighter.",
    reflection: "Finishing a checkpoint, reopening saved work, or reviewing one weak area can reduce a lot of later pressure.",
    focusLabel: "Lower tomorrow's pressure",
    colour: "teal",
  },
  {
    quote: "Learning sticks through steady returns, not one giant burst.",
    reflection: "The best study rhythm is the one a learner can come back to again tomorrow.",
    focusLabel: "Build a rhythm",
    colour: "sky",
  },
  {
    quote: "It is okay if today is about rebuilding momentum.",
    reflection: "The right next step is not always the biggest one. Sometimes it is just the most manageable one.",
    focusLabel: "Rebuild momentum kindly",
    colour: "amber",
  },
];

export function getDailyMotivation(date = new Date()): DailyMotivation {
  const utcDateKey = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const dayIndex = Math.floor(utcDateKey / 86_400_000) % dailyMotivationLibrary.length;

  return dailyMotivationLibrary[dayIndex] ?? dailyMotivationLibrary[0];
}
