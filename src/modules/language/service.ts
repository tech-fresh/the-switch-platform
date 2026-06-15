import type {
  AppCopyCatalog,
  LocalePreference,
  SupportedLocale,
} from "./types";

const defaultLocale: SupportedLocale = "en-GB";

const mockLocalePreferences = new Map<string, LocalePreference>([
  ["student-demo", { userId: "student-demo", locale: defaultLocale }],
]);

const appCopyCatalogs: Record<SupportedLocale, AppCopyCatalog> = {
  "en-GB": {
    locale: "en-GB",
    routes: {
      "/": {
        label: "Home",
        description: "Start from the connected student home surface.",
      },
      "/dashboard": {
        label: "Dashboard",
        description: "See readiness, active sessions, and next-step guidance.",
      },
      "/how-it-works": {
        label: "How It Works",
        description: "Follow a guided click-through explanation of the website routes and meanings.",
      },
      "/subjects": {
        label: "Subjects",
        description: "Revise by subject and move into topic-level practice.",
      },
      "/assessments": {
        label: "Assessments",
        description: "Use timed checkpoints with official duration caps.",
      },
      "/exams": {
        label: "Exams",
        description: "Resume full exam papers with autosave-backed state.",
      },
      "/progress": {
        label: "Progress",
        description: "Track Power Grid readiness and subject momentum.",
      },
      "/saved-progress": {
        label: "Saved Progress",
        description: "Return to any saved exam or timed assessment session.",
      },
      "/support": {
        label: "Support Hub",
        description: "Find trusted UK support links and exam stress guidance for young people.",
      },
      "/recommendations": {
        label: "Recommendations",
        description: "Follow the next best actions built from student signals.",
      },
      "/accessibility": {
        label: "Accessibility",
        description: "Control support settings and read aloud preferences.",
      },
      "/results": {
        label: "Results",
        description: "Review outcomes and decide what to work on next.",
      },
    },
    recommendationCategories: {
      "revise-next": {
        actionLabel: "Open subjects",
        eyebrow: "Revise next",
      },
      "timed-practice": {
        actionLabel: "Open assessments",
        eyebrow: "Timed practice",
      },
      "exam-readiness": {
        actionLabel: "Open exams",
        eyebrow: "Exam readiness",
      },
      "access-support": {
        actionLabel: "Open accessibility",
        eyebrow: "Access support",
      },
      "resume-saved": {
        actionLabel: "Open saved progress",
        eyebrow: "Saved progress",
      },
      "review-results": {
        actionLabel: "Open results",
        eyebrow: "Review results",
      },
    },
  },
};

export function getSupportedLocales(): SupportedLocale[] {
  return Object.keys(appCopyCatalogs) as SupportedLocale[];
}

export async function getLocalePreference(userId: string): Promise<LocalePreference> {
  return mockLocalePreferences.get(userId) ?? {
    userId,
    locale: defaultLocale,
  };
}

export async function getAppCopyCatalog(locale: SupportedLocale = defaultLocale): Promise<AppCopyCatalog> {
  return appCopyCatalogs[locale];
}

export async function getRouteCopy(locale?: SupportedLocale): Promise<AppCopyCatalog["routes"]> {
  return (await getAppCopyCatalog(locale)).routes;
}
