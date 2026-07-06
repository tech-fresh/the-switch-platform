import Link from "next/link";
import type { ReactNode } from "react";

import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";
import { MarketingSiteHeader } from "@/components/mock-idea/marketing-site-header";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { SwitchBrandLogo } from "@/components/switch-brand-logo";

const PLACEMENTS = [
  {
    id: "hero",
    label: "Homepage hero",
    detail: "Full-width toggle mark on the public hero gradient — no box crop, translucent on stone/teal wash.",
  },
  {
    id: "header",
    label: "Marketing header",
    detail: "Horizontal logo in the top chrome on `/`, `/login`, `/how-it-works`, and `/support`.",
  },
  {
    id: "login",
    label: "Sign-in",
    detail: "Same mark above the provider-first sign-in card.",
  },
  {
    id: "shell",
    label: "Signed-in shell",
    detail: "Dashboard, subjects, exams, and progress use the mark in the student header rail.",
  },
  {
    id: "footer",
    label: "Marketing footer",
    detail: "Translucent mark on the dark stone footer band.",
  },
] as const;

function MockPanel({
  title,
  detail,
  children,
  className = "",
}: {
  title: string;
  detail: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm ${className}`}>
      <div className="border-b border-stone-200 bg-stone-50 px-5 py-4">
        <h3 className="text-sm font-semibold text-stone-950">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-stone-600">{detail}</p>
      </div>
      {children}
    </article>
  );
}

export function BrandLogoMockup() {
  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">
          Brand mockup · Official Switch toggle
        </p>
        <div className="rounded-[2rem] border border-teal-200 bg-teal-50/70 px-6 py-6">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
            Brain → lightbulb mark across public and signed-in chrome
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            Transparent PNG on Study Atelier surfaces. Hero uses the full horizontal artwork; headers use the same
            aspect ratio at readable width. Opacity stays at 85% so the mark sits softly on stone backgrounds per the
            UI masterplan.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/" className="rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900">
              Live homepage
            </Link>
            <Link href="/login?reauth=1" className="rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-sky-300">
              Live login
            </Link>
            <Link href="/mock-idea-preview" className="rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-teal-300">
              Visual gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Size scale</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(
            [
              { size: "sm" as const, label: "Compact · favicon context" },
              { size: "md" as const, label: "Header · login" },
              { size: "lg" as const, label: "Large header" },
              { size: "hero" as const, label: "Homepage hero" },
            ] as const
          ).map((item) => (
            <div key={item.size} className="rounded-3xl border border-stone-200 bg-stone-100 px-5 py-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">{item.label}</p>
              <div className="mt-4 flex min-h-24 items-center">
                <SwitchBrandLogo href={undefined} size={item.size} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Mockup 1 · Homepage hero</p>
        <MockPanel title={PLACEMENTS[0].label} detail={PLACEMENTS[0].detail}>
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.12),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.1),_transparent_30%),linear-gradient(180deg,_#ffffff,_#f5f5f4)] px-6 py-12 sm:px-10 sm:py-16">
            <SwitchBrandLogo href="/" size="hero" />
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800">Mark 4 direction</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              GCSE revision with a clearer next step on every screen.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Hero mock — full toggle width, no square crop, translucent on the stone/teal wash.
            </p>
          </div>
        </MockPanel>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Mockup 2 · Marketing chrome</p>
        <MockPanel title={PLACEMENTS[1].label} detail={PLACEMENTS[1].detail}>
          <div className="overflow-hidden border-b border-stone-200">
            <MarketingSiteHeader isAuthenticated={false} />
          </div>
          <div className="bg-stone-100 px-6 py-10 text-sm text-stone-600">Page content area</div>
          <MarketingSiteFooter />
        </MockPanel>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Mockup 3 · Sign-in</p>
        <MockPanel title={PLACEMENTS[2].label} detail={PLACEMENTS[2].detail}>
          <div className="bg-stone-100 px-6 py-10">
            <div className="mx-auto max-w-md space-y-6">
              <SwitchBrandLogo href="/" size="md" />
              <div className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm">
                <h3 className="text-xl font-semibold text-stone-950">Welcome back!</h3>
                <p className="mt-2 text-sm text-stone-600">Provider-first sign-in card preview.</p>
                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800">
                    Continue with Google
                  </div>
                  <div className="rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800">
                    Continue with Microsoft
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MockPanel>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Mockup 4 · Signed-in shell</p>
        <MockPanel title={PLACEMENTS[3].label} detail={PLACEMENTS[3].detail}>
          <StudentAppShell displayName="Student">
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <p className="text-sm text-stone-600">Mission Control and study routes sit below the branded header rail.</p>
            </div>
          </StudentAppShell>
        </MockPanel>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Background contrast check</p>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-stone-200 bg-stone-100 px-6 py-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">Stone 100 page</p>
            <div className="mt-4">
              <SwitchBrandLogo href={undefined} size="md" />
            </div>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white px-6 py-8 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">White card</p>
            <div className="mt-4">
              <SwitchBrandLogo href={undefined} size="md" />
            </div>
          </div>
          <div className="rounded-3xl border border-stone-800 bg-stone-950 px-6 py-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">Stone 950 footer</p>
            <div className="mt-4">
              <SwitchBrandLogo href={undefined} size="md" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
