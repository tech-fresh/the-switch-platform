import type { AuthAccessPathSummary, AuthAllowlistEntry, AuthRole, AuthSession } from "./types";

export function splitAllowlistEmails(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminAllowlistEmails(): string[] {
  return splitAllowlistEmails(process.env.SWITCH_AUTH_ADMIN_EMAILS);
}

export function getEditorAllowlistEmails(): string[] {
  return splitAllowlistEmails(process.env.SWITCH_AUTH_EDITOR_EMAILS);
}

export function maskAllowlistEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  const [localPart, domain] = normalized.split("@");

  if (!localPart || !domain) {
    return "***";
  }

  if (localPart.length <= 1) {
    return `*@${domain}`;
  }

  return `${localPart[0]}***@${domain}`;
}

export function mapRolesFromEmail(email: string): AuthRole[] {
  const normalizedEmail = email.trim().toLowerCase();
  const roles: AuthRole[] = [];

  if (getEditorAllowlistEmails().includes(normalizedEmail)) {
    roles.push("editor");
  }

  if (getAdminAllowlistEmails().includes(normalizedEmail)) {
    roles.push("admin");
  }

  return roles;
}

function buildAllowlistEntries(currentEmail?: string): AuthAllowlistEntry[] {
  const normalizedCurrent = currentEmail?.trim().toLowerCase();
  const entries: AuthAllowlistEntry[] = [];

  for (const email of getAdminAllowlistEmails()) {
    entries.push({
      maskedEmail: maskAllowlistEmail(email),
      role: "admin",
      isCurrentUser: normalizedCurrent === email,
    });
  }

  for (const email of getEditorAllowlistEmails()) {
    if (getAdminAllowlistEmails().includes(email)) {
      continue;
    }

    entries.push({
      maskedEmail: maskAllowlistEmail(email),
      role: "editor",
      isCurrentUser: normalizedCurrent === email,
    });
  }

  return entries;
}

export function buildAuthAccessPathSummary(session: AuthSession): AuthAccessPathSummary {
  const authenticatedSession = session.status === "authenticated" ? session : null;
  const currentEmail = authenticatedSession?.user.email;
  const currentRoles = authenticatedSession?.user.roles ?? [];
  const mappedRoles = currentEmail ? mapRolesFromEmail(currentEmail) : [];
  const isAllowlistedAdmin = mappedRoles.includes("admin");
  const isAllowlistedEditor = mappedRoles.includes("editor");
  const canOpenAdmin = currentRoles.some((role) => role === "editor" || role === "admin");
  const canViewAllowlistEntries = canOpenAdmin;

  return {
    model: "one-sign-in-role-allowlist",
    title: "One sign-in, email allowlist for admin",
    description:
      "Students and operators use the same Google or Microsoft sign-in page. There is no separate admin password. After sign-in, the platform checks your email against server allowlists.",
    studentPathLabel: "Learner — opens dashboard, study routes, and onboarding after the 8 setup steps.",
    adminPathLabel:
      "Operator — opens /admin when your signed-in email is listed in SWITCH_AUTH_ADMIN_EMAILS or SWITCH_AUTH_EDITOR_EMAILS.",
    currentUserEmail: currentEmail,
    currentUserRoles: currentRoles,
    mappedRolesFromAllowlist: mappedRoles,
    isAllowlistedAdmin,
    isAllowlistedEditor,
    canOpenAdmin,
    adminAllowlistCount: getAdminAllowlistEmails().length,
    editorAllowlistCount: getEditorAllowlistEmails().length,
    allowlistEntries: canViewAllowlistEntries ? buildAllowlistEntries(currentEmail) : [],
    configurationHint:
      "Add operator emails in SWITCH_AUTH_ADMIN_EMAILS and SWITCH_AUTH_EDITOR_EMAILS on the server, then redeploy. Students do not need to be listed.",
    signInProvider: authenticatedSession?.provider,
    signedInAt: authenticatedSession?.signedInAt,
    sessionExpiresAt: authenticatedSession?.expiresAt,
  };
}
