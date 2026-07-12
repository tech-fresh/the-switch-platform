import Link from "next/link";

import type { AuthAccessPathSummary } from "@/modules/auth/types";
import { mark32Ui } from "@/components/streamlined/mark32-ui";

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
    return "border-[#2D7A72]/35 bg-[#DFF3EE] text-[#134E4A]";
  }

  if (role === "editor") {
    return "border-[#C28B2C]/35 bg-[#F6E7C8] text-[#7C5A17]";
  }

  return "border-[#D7D0C7] bg-[#F1ECE5] text-slate-800";
}

interface AuthAccessPathPanelProps {
  accessPath: AuthAccessPathSummary;
  variant?: "account" | "admin" | "login";
}

export function AuthAccessPathPanel({ accessPath, variant = "account" }: AuthAccessPathPanelProps) {
  const isLogin = variant === "login";
  const isAdmin = variant === "admin";

  return (
    <article className={isLogin ? mark32Ui.card : mark32Ui.card}>
      <div className="space-y-4">
        <div>
          <p className={mark32Ui.eyebrowSm}>
            {isLogin ? "Admin sign-in path" : "Sign-in and allowlist"}
          </p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            {accessPath.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{accessPath.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#D7D0C7] bg-[#F1ECE5] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Student path</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{accessPath.studentPathLabel}</p>
          </div>
          <div className="rounded-2xl border border-[#2D7A72]/25 bg-[#DFF3EE] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F766E]">Admin path</p>
            <p className="mt-2 text-sm leading-6 text-slate-900">{accessPath.adminPathLabel}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className={mark32Ui.statCard}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin allowlist</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{accessPath.adminAllowlistCount}</p>
            <p className="mt-1 text-sm text-slate-600">emails in SWITCH_AUTH_ADMIN_EMAILS</p>
          </div>
          <div className={mark32Ui.statCard}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Editor allowlist</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{accessPath.editorAllowlistCount}</p>
            <p className="mt-1 text-sm text-slate-600">emails in SWITCH_AUTH_EDITOR_EMAILS</p>
          </div>
          <div className={mark32Ui.statCard}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Your access</p>
            <p className="mt-2 text-lg font-bold text-slate-950">
              {accessPath.canOpenAdmin ? "Admin-capable" : "Student"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {accessPath.currentUserRoles.length
                ? accessPath.currentUserRoles.join(", ")
                : "Sign in to resolve roles"}
            </p>
          </div>
        </div>

        {accessPath.currentUserEmail ? (
          <div className="rounded-2xl border border-dashed border-[#2D7A72]/30 bg-[#EEF7F4] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Website sign-in record
            </p>
            <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <p>
                <span className="font-medium text-slate-900">Email:</span> {accessPath.currentUserEmail}
              </p>
              <p>
                <span className="font-medium text-slate-900">Provider:</span>{" "}
                {accessPath.signInProvider ?? "unknown"}
              </p>
              <p>
                <span className="font-medium text-slate-900">Signed in:</span>{" "}
                {formatTimestamp(accessPath.signedInAt)}
              </p>
              <p>
                <span className="font-medium text-slate-900">Session expires:</span>{" "}
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
                <span className="border border-[#D7D0C7] bg-white px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                  not on admin/editor allowlist
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {accessPath.allowlistEntries.length ? (
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700">
              Configured allowlist (masked)
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {accessPath.allowlistEntries.map((entry) => (
                <div
                  key={`${entry.role}-${entry.maskedEmail}`}
                  className={`rounded-xl border px-3 py-2 text-sm ${entry.isCurrentUser ? "border-[#2D7A72]/35 bg-[#DFF3EE]" : "border-[#D7D0C7] bg-[#F1ECE5]"}`}
                >
                  <span
                    className={`mr-2 border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${roleBadgeClasses(entry.role)}`}
                  >
                    {entry.role}
                  </span>
                  {entry.maskedEmail}
                  {entry.isCurrentUser ? " • you" : ""}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <p className="text-sm leading-6 text-slate-600">{accessPath.configurationHint}</p>

        <div className="flex flex-wrap gap-3">
          {accessPath.canOpenAdmin ? (
            <Link href="/admin" className={mark32Ui.primaryBtn}>
              Open admin dashboard
            </Link>
          ) : isLogin || isAdmin ? (
            <Link
              href="/login?intent=admin&returnTo=/admin"
              className={mark32Ui.secondaryBtn}
            >
              Sign in for admin access
            </Link>
          ) : null}
          <Link href="/account/live-cookie-guide" className={mark32Ui.secondaryBtn}>
            Live cookie guide
          </Link>
        </div>
      </div>
    </article>
  );
}
