export interface DailyMotivation {
  quote: string;
  speaker: string;
  region: string;
  occupation: string;
  theme: string;
  reflection: string;
  focusLabel: string;
  colour: "teal" | "amber" | "sky" | "rose";
  learnMoreHref?: string;
}

const dailyMotivationLibrary: DailyMotivation[] = [
  {
    quote: "It always seems impossible until it's done.",
    speaker: "Nelson Mandela",
    region: "South Africa · Africa",
    occupation: "Anti-apartheid leader and former President",
    theme: "Perseverance",
    reflection: "Hard revision topics often feel biggest at the start. Returning to them steadily is still real progress.",
    focusLabel: "Keep going through the hard bit",
    colour: "teal",
    learnMoreHref: "/support",
  },
  {
    quote: "Nothing in life is to be feared, it is only to be understood.",
    speaker: "Marie Curie",
    region: "Poland and France · Europe",
    occupation: "Physicist and chemist",
    theme: "Understanding",
    reflection: "Confusion is often the starting point of learning. The next useful step is to make one part clearer.",
    focusLabel: "Understand one thing better",
    colour: "amber",
    learnMoreHref: "/subjects",
  },
  {
    quote: "One child, one teacher, one book, one pen can change the world.",
    speaker: "Malala Yousafzai",
    region: "Pakistan · Asia",
    occupation: "Education activist and Nobel Peace Prize laureate",
    theme: "Education",
    reflection: "The tools for progress are often simple: one page, one question, one return to the work.",
    focusLabel: "Use the tools in front of you",
    colour: "sky",
    learnMoreHref: "/how-it-works",
  },
  {
    quote: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.",
    speaker: "A. P. J. Abdul Kalam",
    region: "India · Asia",
    occupation: "Aerospace scientist and former President",
    theme: "Action",
    reflection: "Goals matter most when they lead to the next action. Pick the step you can finish today.",
    focusLabel: "Turn goals into action",
    colour: "rose",
    learnMoreHref: "/progress",
  },
  {
    quote: "Do your little bit of good where you are; it's those little bits of good put together that overwhelm the world.",
    speaker: "Desmond Tutu",
    region: "South Africa · Africa",
    occupation: "Cleric and human rights activist",
    theme: "Contribution",
    reflection: "Short revision blocks add up. A learner does not need a huge session for the day to count.",
    focusLabel: "Let the small wins add up",
    colour: "teal",
    learnMoreHref: "/dashboard",
  },
  {
    quote: "I have learned over the years that when one's mind is made up, this diminishes fear.",
    speaker: "Rosa Parks",
    region: "United States · North America",
    occupation: "Civil rights activist",
    theme: "Resolve",
    reflection: "Choosing the next task can reduce the stress of starting. Decide first, then begin.",
    focusLabel: "Decide the next move first",
    colour: "sky",
    learnMoreHref: "/saved-progress",
  },
  {
    quote: "I don't carry the weight of the world on my shoulders. I remember that I am part of the world.",
    speaker: "Wangari Maathai",
    region: "Kenya · Africa",
    occupation: "Environmental activist and Nobel Peace Prize laureate",
    theme: "Shared effort",
    reflection: "Students do not have to solve everything at once. One manageable contribution to the day is enough.",
    focusLabel: "Take one manageable step",
    colour: "amber",
    learnMoreHref: "/support",
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    speaker: "C. S. Lewis",
    region: "United Kingdom and Ireland · Europe",
    occupation: "Writer and scholar",
    theme: "Fresh starts",
    reflection: "A slow week or a missed session does not end the journey. The learner can reset and continue.",
    focusLabel: "Reset and continue",
    colour: "rose",
    learnMoreHref: "/recommendations",
  },
  {
    quote: "If you can dream it, you can do it.",
    speaker: "Walt Disney",
    region: "United States · North America",
    occupation: "Animator and creative entrepreneur",
    theme: "Belief",
    reflection: "Confidence grows when the learner follows intention with action, even in a short study block.",
    focusLabel: "Back the plan with action",
    colour: "teal",
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    speaker: "Eleanor Roosevelt",
    region: "United States · North America",
    occupation: "Diplomat and human rights advocate",
    theme: "Hope",
    reflection: "Ambitious goals work best when the learner keeps sight of why the work matters.",
    focusLabel: "Remember what you are building",
    colour: "sky",
  },
  {
    quote: "The more you know, the more you realize you don't know.",
    speaker: "Aristotle",
    region: "Greece · Europe",
    occupation: "Philosopher and teacher",
    theme: "Curiosity",
    reflection: "Needing more explanation is not failure. It is part of learning carefully.",
    focusLabel: "Stay curious, not discouraged",
    colour: "amber",
  },
  {
    quote: "The world promises you comfort, but you were not made for comfort. You were made for greatness.",
    speaker: "Pope Benedict XVI",
    region: "Germany · Europe",
    occupation: "Catholic leader and theologian",
    theme: "Courage",
    reflection: "Some revision sessions ask for patience and effort. Growth often comes through that stretch.",
    focusLabel: "Choose the braver next step",
    colour: "rose",
  },
];

export function getDailyMotivation(date = new Date()): DailyMotivation {
  const utcDateKey = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const dayIndex = Math.floor(utcDateKey / 86_400_000) % dailyMotivationLibrary.length;

  return dailyMotivationLibrary[dayIndex] ?? dailyMotivationLibrary[0];
}
