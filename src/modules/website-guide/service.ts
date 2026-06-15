import { getRouteCopy } from "@/modules/language/service";
import type { WebsiteGuideData } from "./types";

export async function getWebsiteGuideData(): Promise<WebsiteGuideData> {
  const routes = await getRouteCopy();

  return {
    title: "How The Switch works, step by step",
    description:
      "Use this guide when you want to understand what each route does, where to click next, and what the main study signals mean while you move through the website.",
    suggestedFirstRoute: "/dashboard",
    steps: [
      {
        stepId: "step-home-dashboard",
        stepNumber: 1,
        title: "Start from Home or Dashboard",
        description:
          "Begin on the main launch surface to see what is active, what needs attention, and which route should be opened next.",
        whyItMatters:
          "This is the quickest place to understand your current study state without checking every route one by one.",
        routeLabel: routes["/dashboard"]?.label ?? "Dashboard",
        href: "/dashboard",
        actionLabel: "Open dashboard",
        quickChecks: [
          "Look at the readiness score.",
          "Check the recommended next action.",
          "Use the live route cards to jump into study.",
        ],
      },
      {
        stepId: "step-subjects",
        stepNumber: 2,
        title: "Open a subject and topic",
        description:
          "Choose a subject, switch topics, and read the revision guidance before jumping into practice.",
        whyItMatters:
          "This is where the learning part begins before timed work or exam-style pressure is added.",
        routeLabel: routes["/subjects"]?.label ?? "Subjects",
        href: "/subjects",
        actionLabel: "Open subjects",
        quickChecks: [
          "Choose the subject you want to improve.",
          "Switch to a topic that matches your weak area.",
          "Read the revision summary before answering questions.",
        ],
      },
      {
        stepId: "step-assessments",
        stepNumber: 3,
        title: "Use timed checkpoints",
        description:
          "Move into a shorter timed assessment when you want to test recall without opening a full exam paper.",
        whyItMatters:
          "This route helps you practise under time pressure in smaller sessions.",
        routeLabel: routes["/assessments"]?.label ?? "Assessments",
        href: "/assessments",
        actionLabel: "Open assessments",
        quickChecks: [
          "Pick a time option within the allowed cap.",
          "Use notes and bookmarks if something needs revisiting.",
          "Return later through Saved Progress if you stop mid-session.",
        ],
      },
      {
        stepId: "step-exams",
        stepNumber: 4,
        title: "Sit a fuller exam session",
        description:
          "Open the exam route when you want a more complete paper flow with question navigation, flags, working notes, and timing.",
        whyItMatters:
          "This is the main exam-readiness route in the current MVP.",
        routeLabel: routes["/exams"]?.label ?? "Exams",
        href: "/exams",
        actionLabel: "Open exams",
        quickChecks: [
          "Use working notes for steps or quotations.",
          "Flag questions you want to review later.",
          "Submit when you are ready, then check Results or start a fresh attempt.",
        ],
      },
      {
        stepId: "step-saved-progress",
        stepNumber: 5,
        title: "Resume anything you left unfinished",
        description:
          "Use Saved Progress to reopen active sessions and continue from the right question or timed checkpoint.",
        whyItMatters:
          "You do not need to remember where you stopped. The website stores that route for you.",
        routeLabel: routes["/saved-progress"]?.label ?? "Saved Progress",
        href: "/saved-progress",
        actionLabel: "Open saved progress",
        quickChecks: [
          "Check whether the session is still active or already submitted.",
          "Use the resume link instead of starting again.",
          "Look for stored support snapshots if access settings matter.",
        ],
      },
      {
        stepId: "step-progress-recommendations",
        stepNumber: 6,
        title: "Use Progress and Recommendations to decide what comes next",
        description:
          "After some activity, open Progress and Recommendations to see what the platform thinks needs attention next.",
        whyItMatters:
          "These routes turn activity into study decisions so the student does not have to guess the next move.",
        routeLabel: routes["/progress"]?.label ?? "Progress",
        href: "/progress",
        actionLabel: "Open progress",
        quickChecks: [
          "Use Progress to see readiness by subject.",
          "Use Recommendations to follow the next best action.",
          "Open Results when work has already been submitted.",
        ],
      },
      {
        stepId: "step-support-accessibility",
        stepNumber: 7,
        title: "Check support settings when needed",
        description:
          "Use Accessibility and Support Hub to understand read aloud, support-aware settings, and trusted signposting for exam pressure.",
        whyItMatters:
          "These routes explain what help the website can provide and where to go for trusted external support.",
        routeLabel: routes["/accessibility"]?.label ?? "Accessibility",
        href: "/accessibility",
        actionLabel: "Open accessibility",
        quickChecks: [
          "Preview read aloud settings before a session.",
          "Use Support Hub for trusted UK support links.",
          "Remember that support routes do not replace urgent help services.",
        ],
      },
    ],
    glossary: [
      {
        termId: "term-autosave",
        term: "Autosave",
        meaning:
          "The website stores your current session state as you work so you can come back later without starting from the beginning.",
      },
      {
        termId: "term-power-grid",
        term: "Power Grid",
        meaning:
          "The progress model that turns your activity into a readiness score, level, trend, and next best focus.",
      },
      {
        termId: "term-support-snapshot",
        term: "Support snapshot",
        meaning:
          "A saved record of active support or access settings that can travel with a student session.",
      },
      {
        termId: "term-flagged-question",
        term: "Flagged question",
        meaning:
          "A question you marked to review again before finishing the session.",
      },
      {
        termId: "term-submitted",
        term: "Submitted",
        meaning:
          "A session that has been finished and is now ready to review through the results flow instead of being resumed as active work.",
      },
      {
        termId: "term-recommendations",
        term: "Recommendations",
        meaning:
          "Ordered next-step actions built from progress, saved work, results, and support signals.",
      },
    ],
  };
}
