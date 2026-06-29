import Link from "next/link";

/** CSS device mockup for the Mark 3.2 marketing homepage hero. */
export function Mark32DevicePreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="relative rounded-3xl border border-violet-200 bg-white p-3 shadow-2xl shadow-violet-200/50">
        <div className="overflow-hidden rounded-2xl bg-[#f7f8ff]">
          <div className="flex items-center gap-2 border-b border-violet-100 bg-white px-4 py-2">
            <span className="size-2.5 rounded-full bg-rose-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 text-[10px] font-semibold text-violet-600">theswitchplatform.com/dashboard</span>
          </div>
          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)]">
            <div className="space-y-1 bg-[#12005f] p-2">
              {["⌂", "▦", "✎", "◷"].map((icon, index) => (
                <div
                  key={icon}
                  className={`grid size-7 place-items-center rounded-lg text-xs ${
                    index === 0 ? "bg-white text-violet-700" : "text-violet-200"
                  }`}
                >
                  {icon}
                </div>
              ))}
            </div>
            <div className="space-y-2 p-3">
              <p className="text-xs font-bold text-violet-700">Good morning, Lloyd! ⚡</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-violet-100 bg-white p-2">
                  <p className="text-[9px] font-bold text-violet-600">Continue</p>
                  <p className="text-[10px] font-bold text-slate-900">Maths · Algebra</p>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-violet-100">
                    <div className="h-full w-[72%] rounded-full bg-violet-600" />
                  </div>
                </div>
                <div className="rounded-xl bg-[#140062] p-2 text-white">
                  <p className="text-[9px] font-bold text-violet-200">Power Grid</p>
                  <p className="text-[10px] font-bold">Voltage Rising</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { name: "Maths", pct: 80 },
                  { name: "English", pct: 67 },
                  { name: "Science", pct: 75 },
                ].map((s) => (
                  <div key={s.name} className="rounded-lg border border-slate-200 bg-white p-1.5 text-center">
                    <p className="text-[8px] font-bold text-slate-700">{s.name}</p>
                    <p className="text-[10px] font-black text-violet-700">{s.pct}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -right-2 w-28 rounded-2xl border-4 border-white bg-[#12005f] p-2 shadow-xl sm:-right-6 sm:w-32">
        <div className="rounded-xl bg-[#f7f8ff] p-2">
          <p className="text-[8px] font-bold text-violet-700">Today&apos;s goal</p>
          <p className="text-lg font-black text-emerald-600">65%</p>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[65%] rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="absolute -bottom-10 left-0 text-sm font-semibold text-violet-700 hover:text-violet-900 sm:-bottom-12"
      >
        Open live dashboard →
      </Link>
    </div>
  );
}
