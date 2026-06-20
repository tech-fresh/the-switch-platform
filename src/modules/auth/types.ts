export type AuthProvider = "email-magic-link" | "google" | "apple" | "microsoft";
export type AuthRole = "student" | "editor" | "admin";
export type AuthRuntimeMode = "preview-cookie" | "oidc" | "external-header";

export interface AuthUser {
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  yearGroup: string;
  targetQualifications: string[];
  roles: AuthRole[];
}

export interface AuthenticatedAuthSession {
  sessionId: string;
  user: AuthUser;
  provider: AuthProvider;
  signedInAt: string;
  expiresAt: string;
  status: "authenticated";
}

export interface SignedOutAuthSession {
  status: "signed-out";
  reason?: "missing-session" | "invalid-session" | "expired-session";
}

export type AuthSession = AuthenticatedAuthSession | SignedOutAuthSession;

export interface SignInOption {
  provider: AuthProvider;
  label: string;
  description: string;
}

export interface AuthReadinessSummary {
  mode: AuthRuntimeMode;
  status: "development-only" | "needs-provider-setup" | "ready" | "external-managed";
  configuredProviderCount: number;
  title: string;
  detail: string;
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
  isAuthenticated: boolean;
  session: AuthSession;
  signInOptions: SignInOption[];
  authReadiness: AuthReadinessSummary;
  metrics: AccountMetric[];
  quickLinks: AccountLink[];
  supportSummary: string;
  nextBestAction: string;
  signedOutTitle: string;
  signedOutDescription: string;
}
