"use client";

import Link from "next/link";

import { premiumUi } from "@/components/premium/premium-ui";

const TOOLS = [
  { label: "Calculator", href: "/accessibility", icon: "🧮" },
  { label: "Read aloud", href: "/accessibility", icon: "🔊" },
  { label: "Highlight", href: "/accessibility", icon: "✨" },
  { label: "More tools", href: "/accessibility", icon: "⚙️" },
] as const;

export function PremiumAccessibilityToolbar() {
  return (
    <nav
      className="sticky bottom-4 z-10 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-[#ddd3c6] bg-[#fbf7f0]/95 p-3 shadow-xl backdrop-blur-xl"
      aria-label="Accessibility tools"
    >
      {TOOLS.map((tool) => (
        <Link
          key={tool.label}
          href={tool.href}
          className="inline-flex items-center gap-2 rounded-xl border border-[#ddd3c6] bg-white px-4 py-2.5 text-sm font-semibold text-[#163038] transition hover:border-[#0f766e]/35 hover:bg-[#f7f2ea]"
        >
          <span aria-hidden="true">{tool.icon}</span>
          {tool.label}
        </Link>
      ))}
    </nav>
  );
}
