import Link from "next/link";

import { mark32Ui } from "@/components/streamlined/mark32-ui";

interface StudentRouteRecoveryAction {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}

interface StudentRouteRecoveryProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: StudentRouteRecoveryAction[];
  warnings?: string[];
}

const DEFAULT_ACTIONS: StudentRouteRecoveryAction[] = [
  { href: "/saved-progress", label: "Open saved progress", variant: "primary" },
  { href: "/assessments", label: "Start timed practice", variant: "secondary" },
  { href: "/dashboard", label: "Return to dashboard", variant: "secondary" },
];

export function StudentRouteRecovery({
  eyebrow,
  title,
  description,
  actions = DEFAULT_ACTIONS,
  warnings = [],
}: StudentRouteRecoveryProps) {
  return (
    <section className={mark32Ui.card}>
      <p className={`${mark32Ui.eyebrow} text-amber-700`}>{eyebrow}</p>
      <h1 className={`mt-4 max-w-3xl ${mark32Ui.heading}`}>{title}</h1>
      <p className={`mt-4 max-w-3xl ${mark32Ui.body}`}>{description}</p>

      {warnings.length ? (
        <div className="mt-6 grid gap-3">
          {warnings.map((warning) => (
            <div
              key={warning}
              className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
            >
              {warning}
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {actions.map((action) => (
          <Link
            key={`${action.href}-${action.label}`}
            href={action.href}
            className={action.variant === "primary" ? mark32Ui.primaryBtn : mark32Ui.secondaryBtn}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
