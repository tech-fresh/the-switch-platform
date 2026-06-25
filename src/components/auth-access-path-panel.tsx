import Link from "next/link";

import type { AuthAccessPathSummary } from "@/modules/auth/types";

function formatTimestamp(value?: string): string {
  if (!value) {
    return "Not signed in yet";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function roleBadgeClasses(role: "admin" | "editor" | "student"): string {
  if (role === "admin") {
    return "border-sky-300 bg-sky-50 text-sky-950";
  }

  if (role === "editor") {
    return "border-emerald-300 bg-emerald-50 text-emerald-950";
  }

  return "border-stone-300 bg-stone-100 text-stone-800";
}

interface AuthAccessPathPanelProps {
  accessPath: AuthAccessPathSummary;
  variant?: "account" | "admin" | "login";
}

export function AuthAccessPathPanel({ accessPath, variant = "account" }: AuthAccessPathPanelProps) {
  const isLogin = variant === "login";
  const isAdmin = variant === "admin";

  return (
    <article
      className={`border border-stone-200 bg-white shadow-sm ${
        isLogin ? "rounded-2xl p-5 sm:p-6" : "p-5 sm:p-6"
      }`}
    >
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            {isLogin ? "Admin sign-in path" : "Sign-in and allowlist"}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">
            {accessPath.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{accessPath.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Student path</p>
            <p className="mt-2 text-sm leading-6 text-stone-700">{accessPath.studentPathLabel}</p>
          </div>
          <div className="border border-sky-200 bg-sky-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Admin path</p>
            <p className="mt-2 text-sm leading-6 text-sky-950">{accessPath.adminPathLabel}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Admin allowlist</p>
            <p className="mt-2 text-2xl font-semibold text-stone-950">{accessPath.adminAllowlistCount}</p>
            <p className="mt-1 text-sm text-stone-600">emails in SWITCH_AUTH_ADMIN_EMAILS</p>
          </div>
          <div className="border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Editor allowlist</p>
            <p className="mt-2 text-2xl font-semibold text-stone-950">{accessPath.editorAllowlistCount}</p>
            <p className="mt-1 text-sm text-stone-600">emails in SWITCH_AUTH_EDITOR_EMAILS</p>
          </div>
          <div className="border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Your access</p>
            <p className="mt-2 text-lg font-semibold text-stone-950">
              {accessPath.canOpenAdmin ? "Admin-capable" : "Student"}
            </p>
            <p className="mt-1 text-sm text-stone-600">
              {accessPath.currentUserRoles.length
                ? accessPath.currentUserRoles.join(", ")
                : "Sign in to resolve roles"}
            </p>
          </div>
        </div>

        {accessPath.currentUserEmail ? (
          <div className="border border-dashed border-stone-300 bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Website sign-in record
            </p>
            <div className="mt-3 grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
              <p>
                <span className="font-medium text-stone-900">Email:</span> {accessPath.currentUserEmail}
              </p>
              <p>
                <span className="font-medium text-stone-900">Provider:</span>{" "}
                {accessPath.signInProvider ?? "unknown"}
              </p>
              <p>
                <span className="font-medium text-stone-900">Signed in:</span>{" "}
                {formatTimestamp(accessPath.signedInAt)}
              </p>
              <p>
                <span className="font-medium text-stone-900">Session expires:</span>{" "}
                {formatTimestamp(accessPath.sessionExpiresAt)}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {accessPath.mappedRolesFromAllowlist.map((role) => (
                <span
                  key={`mapped-${role}`}
                  className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${roleBadgeClasses(role)}`}
                >
                  allowlist: {role}
                </span>
              ))}
              {accessPath.mappedRolesFromAllowlist.length === 0 ? (
                <span className="border border-stone-300 bg-white px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
                  not on admin/editor allowlist
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {accessPath.allowlistEntries.length ? (
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
              Configured allowlist (masked)
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {accessPath.allowlistEntries.map((entry) => (
                <div
                  key={`${entry.role}-${entry.maskedEmail}`}
                  className={`border px-3 py-2 text-sm ${entry.isCurrentUser ? "border-sky-300 bg-sky-50" : "border-stone-200 bg-stone-50"}`}
                >
                  <span className={`mr-2 border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${roleBadgeClasses(entry.role)}`}>
                    {entry.role}
                  </span>
                  {entry.maskedEmail}
                  {entry.isCurrentUser ? " • you" : ""}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <p className="text-sm leading-6 text-stone-600">{accessPath.configurationHint}</p>

        <div className="flex flex-wrap gap-3">
          {accessPath.canOpenAdmin ? (
            <Link
              href="/admin"
              className="inline-flex border border-sky-700 bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800"
            >
              Open admin dashboard
            </Link>
          ) : isLogin || isAdmin ? (
            <Link
              href="/login?intent=admin&returnTo=/admin"
              className="inline-flex border border-sky-300 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-900 hover:bg-white"
            >
              Sign in for admin access
            </Link>
          ) : null}
          <Link
            href="/account/live-cookie-guide"
            className="inline-flex border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400"
          >
            Live cookie guide
          </Link>
        </div>
      </div>
    </article>
  );
}
