import Link from "next/link";

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
    <section className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">{description}</p>

      {warnings.length ? (
        <div className="mt-6 grid gap-3">
          {warnings.map((warning) => (
            <div key={warning} className="border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
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
            className={
              action.variant === "primary"
                ? "inline-flex items-center justify-center bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
                : "inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400"
            }
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
