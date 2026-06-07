export interface WebsiteGuideStep {
  stepId: string;
  stepNumber: number;
  title: string;
  description: string;
  whyItMatters: string;
  routeLabel: string;
  href: string;
  actionLabel: string;
  quickChecks: string[];
}

export interface WebsiteGuideTerm {
  termId: string;
  term: string;
  meaning: string;
}

export interface WebsiteGuideData {
  title: string;
  description: string;
  suggestedFirstRoute: string;
  steps: WebsiteGuideStep[];
  glossary: WebsiteGuideTerm[];
}
