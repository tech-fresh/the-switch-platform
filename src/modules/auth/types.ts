export type AuthProvider = "email-magic-link" | "google" | "apple";

export interface AuthUser {
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  yearGroup: string;
  targetQualifications: string[];
}

export interface AuthSession {
  sessionId: string;
  user: AuthUser;
  provider: AuthProvider;
  signedInAt: string;
  status: "authenticated" | "signed-out";
}

export interface SignInOption {
  provider: AuthProvider;
  label: string;
  description: string;
}

export interface AccountMetric {
  label: string;
  value: string;
  detail: string;
}

export interface AccountLink {
  href: string;
  label: string;
  description: string;
}

export interface AccountOverview {
  session: AuthSession;
  signInOptions: SignInOption[];
  metrics: AccountMetric[];
  quickLinks: AccountLink[];
  supportSummary: string;
  nextBestAction: string;
}
