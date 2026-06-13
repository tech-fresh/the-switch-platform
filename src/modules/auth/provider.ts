import type { AuthProvider, AuthRole, AuthUser, SignInOption } from "./types";
import { getAuthRuntimeConfig } from "./runtime";

export interface ResolvedAuthSessionUser {
  user: AuthUser;
  provider: AuthProvider;
}

export interface OidcProviderConfig {
  provider: AuthProvider;
  label: string;
  description: string;
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
  prompt?: string;
}

export interface OidcProfile {
  sub?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  preferred_username?: string;
  roles?: string[] | string;
  role?: string[] | string;
  year_group?: string;
  target_qualifications?: string[] | string;
}

const authUsers: Record<string, AuthUser> = {
  "student-demo": {
    userId: "student-demo",
    firstName: "Maya",
    lastName: "Okafor",
    displayName: "Maya Okafor",
    email: "maya.okafor@student.switch.local",
    yearGroup: "Year 11",
    targetQualifications: ["GCSE Mathematics", "GCSE English Language", "GCSE Combined Science"],
    roles: ["student"],
  },
  "editor-demo": {
    userId: "editor-demo",
    firstName: "Jordan",
    lastName: "Adebayo",
    displayName: "Jordan Adebayo",
    email: "jordan.adebayo@staff.switch.local",
    yearGroup: "Editorial preview",
    targetQualifications: ["Content review", "Editorial workflow", "Launch governance"],
    roles: ["editor", "admin"],
  },
};

const previewSignInOptions: SignInOption[] = [
  {
    provider: "email-magic-link",
    label: "Email magic link",
    description: "Fast sign in for students without needing a password-first flow in the MVP.",
  },
  {
    provider: "google",
    label: "Google",
    description: "Preview staff sign in for editorial and admin-protected routes.",
  },
  {
    provider: "apple",
    label: "Apple",
    description: "Future-ready sign in option for mobile and privacy-focused account flows.",
  },
];

export async function listSignInOptions(): Promise<SignInOption[]> {
  const runtime = getAuthRuntimeConfig();

  if (runtime.mode === "preview-cookie") {
    return previewSignInOptions;
  }

  if (runtime.mode === "oidc") {
    return getConfiguredOidcProviders().map((provider) => ({
      provider: provider.provider,
      label: provider.label,
      description: provider.description,
    }));
  }

  return [];
}

export async function resolvePreviewUserForProvider(
  provider: AuthProvider,
  userId = "student-demo",
): Promise<ResolvedAuthSessionUser | null> {
  const providerDefaultUserId = provider === "google" ? "editor-demo" : "student-demo";
  const user = authUsers[userId] ?? authUsers[providerDefaultUserId];

  if (!user) {
    return null;
  }

  return {
    user,
    provider,
  };
}

export async function getPreviewUserById(userId: string): Promise<AuthUser | null> {
  return authUsers[userId] ?? null;
}

export function getConfiguredOidcProviders(): OidcProviderConfig[] {
  return ["email-magic-link", "google", "apple"]
    .map((provider) => getConfiguredOidcProvider(provider as AuthProvider))
    .filter((provider): provider is OidcProviderConfig => Boolean(provider));
}

export function getConfiguredOidcProvider(provider: AuthProvider): OidcProviderConfig | null {
  const envPrefix = getProviderEnvPrefix(provider);
  const clientId = process.env[`SWITCH_OIDC_${envPrefix}_CLIENT_ID`]?.trim();
  const clientSecret = process.env[`SWITCH_OIDC_${envPrefix}_CLIENT_SECRET`]?.trim();
  const authorizationUrl = process.env[`SWITCH_OIDC_${envPrefix}_AUTHORIZATION_URL`]?.trim();
  const tokenUrl = process.env[`SWITCH_OIDC_${envPrefix}_TOKEN_URL`]?.trim();
  const userInfoUrl = process.env[`SWITCH_OIDC_${envPrefix}_USERINFO_URL`]?.trim();

  if (!clientId || !clientSecret || !authorizationUrl || !tokenUrl || !userInfoUrl) {
    return null;
  }

  return {
    provider,
    label: getProviderLabel(provider),
    description: getOidcDescription(provider),
    clientId,
    clientSecret,
    authorizationUrl,
    tokenUrl,
    userInfoUrl,
    scopes: (process.env[`SWITCH_OIDC_${envPrefix}_SCOPES`]?.trim() || "openid profile email")
      .split(/\s+/)
      .filter(Boolean),
    prompt: process.env[`SWITCH_OIDC_${envPrefix}_PROMPT`]?.trim() || undefined,
  };
}

export function mapOidcProfileToAuthUser(profile: OidcProfile): AuthUser {
  const email = profile.email?.trim() || `${profile.sub ?? "switch-user"}@switch.local`;
  const displayName = profile.name?.trim() || profile.preferred_username?.trim() || email;
  const [firstName = email, ...lastNameParts] = displayName.split(" ");
  const explicitRoles = normalizeClaimRoles(profile.roles ?? profile.role);
  const mappedRoles = mapRolesFromEmail(email);
  const roles = uniqueRoles(explicitRoles.concat(mappedRoles).concat(["student"]));
  const targetQualifications = normalizeStringArray(profile.target_qualifications);

  return {
    userId: profile.sub?.trim() || email,
    firstName,
    lastName: profile.family_name?.trim() || lastNameParts.join(" ") || "Learner",
    displayName,
    email,
    yearGroup: profile.year_group?.trim() || "Authenticated learner",
    targetQualifications,
    roles,
  };
}

function getProviderEnvPrefix(provider: AuthProvider): string {
  if (provider === "email-magic-link") {
    return "EMAIL_MAGIC_LINK";
  }

  return provider.toUpperCase();
}

function getProviderLabel(provider: AuthProvider): string {
  if (provider === "email-magic-link") {
    return "Email magic link";
  }

  if (provider === "google") {
    return "Google";
  }

  return "Apple";
}

function getOidcDescription(provider: AuthProvider): string {
  if (provider === "email-magic-link") {
    return "Production sign-in through your configured identity provider magic-link flow.";
  }

  if (provider === "google") {
    return "Production sign-in through your configured Google identity provider flow.";
  }

  return "Production sign-in through your configured Apple identity provider flow.";
}

function normalizeClaimRoles(value: string[] | string | undefined): AuthRole[] {
  const roles = Array.isArray(value) ? value : value ? value.split(",") : [];

  return roles
    .map((role) => role.trim())
    .filter((role): role is AuthRole => role === "student" || role === "editor" || role === "admin");
}

function mapRolesFromEmail(email: string): AuthRole[] {
  const normalizedEmail = email.trim().toLowerCase();
  const roles: AuthRole[] = [];
  const editorEmails = splitEmails(process.env.SWITCH_AUTH_EDITOR_EMAILS);
  const adminEmails = splitEmails(process.env.SWITCH_AUTH_ADMIN_EMAILS);

  if (editorEmails.has(normalizedEmail)) {
    roles.push("editor");
  }

  if (adminEmails.has(normalizedEmail)) {
    roles.push("admin");
  }

  return roles;
}

function splitEmails(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

function normalizeStringArray(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueRoles(roles: AuthRole[]): AuthRole[] {
  return Array.from(new Set(roles));
}
