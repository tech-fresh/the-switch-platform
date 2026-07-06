import Link from "next/link";

import { premiumUi } from "@/components/premium/premium-ui";

export const PREMIUM_BENEFITS = [
  {
    icon: "🎯",
    title: "One calm revision home",
    detail: "Subjects, exams, timed practice, and progress in a single premium flow — no tab hopping.",
  },
  {
    icon: "📊",
    title: "Progress you can feel",
    detail: "XP, Power Grid ranks, readiness scores, and a weekly planner keep motivation high between sessions.",
  },
  {
    icon: "🎛️",
    title: "Built for every learner",
    detail: "Extra time, read aloud, reader mode, and colour overlays persist across study routes.",
  },
] as const;

export const PREMIUM_HOW_IT_WORKS = [
  {
    step: "1",
    title: "Sign in and set up",
    detail: "Eight quick onboarding steps build your personalised dashboard — school, subjects, and accessibility.",
  },
  {
    step: "2",
    title: "Revise and practise",
    detail: "Open topics, answer quiz questions, and sit timed assessments with autosave throughout.",
  },
  {
    step: "3",
    title: "Track and improve",
    detail: "Power Grid ranks, readiness trends, and weakest-topic signals show where to focus next.",
  },
] as const;

export const PREMIUM_FAQ = [
  {
    question: "Is The Switch free to start?",
    answer:
      "Yes — sign in with Google or Microsoft to start revising. Your progress saves automatically as you study.",
  },
  {
    question: "Which qualifications are supported?",
    answer:
      "GCSE (England) and iGCSE for secondary students. Maths, English Language, and Combined Science are live today.",
  },
  {
    question: "How does the Power Grid work?",
    answer:
      "You earn XP from study activity. Six milestone ranks mark your journey, with Power Levels giving frequent wins between promotions.",
  },
  {
    question: "Can I use access arrangements?",
    answer:
      "Yes — set extra time, read aloud, overlays, and reader mode on the accessibility route. Settings follow you across study screens.",
  },
] as const;

export function PremiumHomepageMarketing() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <div>
          <p className={premiumUi.eyebrowAccent}>Why Switch</p>
          <h2 className={`mt-2 ${premiumUi.heading}`}>Premium revision without the noise</h2>
          <p className={`mt-2 max-w-2xl ${premiumUi.body}`}>
            Clear structure, motivating progress, and inclusive design — built for real GCSE study sessions.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {PREMIUM_BENEFITS.map((item) => (
            <article key={item.title} className={premiumUi.card}>
              <span className="text-3xl" aria-hidden="true">
                {item.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
              <p className={`mt-2 ${premiumUi.body}`}>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className={premiumUi.eyebrowAccent}>How it works</p>
          <h2 className={`mt-2 ${premiumUi.heading}`}>From sign-in to exam-ready in three steps</h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {PREMIUM_HOW_IT_WORKS.map((item) => (
            <li key={item.step} className={premiumUi.card}>
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#6C4EFF]/25 text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
              <p className={`mt-2 ${premiumUi.body}`}>{item.detail}</p>
            </li>
          ))}
        </ol>
        <Link href="/how-it-works" className={premiumUi.linkAccent}>
          Read the full guide →
        </Link>
      </section>

      <section className="space-y-6">
        <div>
          <p className={premiumUi.eyebrowAccent}>FAQ</p>
          <h2 className={`mt-2 ${premiumUi.heading}`}>Common questions</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {PREMIUM_FAQ.map((item) => (
            <article key={item.question} className={premiumUi.cardMuted}>
              <h3 className="text-base font-bold text-white">{item.question}</h3>
              <p className={`mt-3 ${premiumUi.body}`}>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
