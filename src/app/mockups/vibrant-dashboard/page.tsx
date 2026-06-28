const subjects = [
  { name: "Maths", progress: 80, colour: "from-violet-500 to-indigo-600", icon: "✚" },
  { name: "English Language", progress: 67, colour: "from-orange-400 to-amber-500", icon: "📖" },
  { name: "Science", progress: 75, colour: "from-emerald-500 to-green-600", icon: "⚗" },
];

const weakTopics = [
  { name: "Probability", score: 24, colour: "bg-pink-500" },
  { name: "Simultaneous Equations", score: 28, colour: "bg-orange-500" },
  { name: "Electricity", score: 32, colour: "bg-amber-400" },
];

const navItems = [
  ["Home", "/dashboard", "⌂"],
  ["Subjects", "/subjects", "▦"],
  ["Practice", "/assessments", "✎"],
  ["Exams", "/exams", "◷"],
  ["Progress", "/progress", "▥"],
  ["Sign up", "/login?reauth=1", "○"],
];

export default function VibrantDashboardMockupPage() {
  return (
    <main className="min-h-screen bg-[#f7f8ff] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="relative hidden overflow-hidden bg-[#12005f] text-white lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.55),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.45),transparent_32%)]" />
          <div className="relative z-10 flex h-full flex-col p-6">
            <a href="/" className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-white text-3xl shadow-xl">⚡</span>
              <span>
                <span className="block text-xl font-black tracking-tight">THE SWITCH</span>
                <span className="block text-xs font-semibold tracking-[0.38em] text-violet-100">PLATFORM</span>
              </span>
            </a>
            <nav className="mt-10 space-y-2">
              {navItems.map(([label, href, icon], index) => (
                <a key={label} href={href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition hover:bg-white hover:text-violet-700 ${index === 0 ? "bg-white text-violet-700 shadow-lg" : "text-violet-50"}`}>
                  <span className="text-lg">{icon}</span>{label}
                </a>
              ))}
            </nav>
            <section className="mt-auto rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="grid size-14 place-items-center rounded-full bg-violet-500 text-3xl">👦🏾</div>
                <div><p className="text-lg font-black">Lloyd</p><p className="text-sm text-violet-100">⚡ Voltage Rising</p></div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full w-[72%] rounded-full bg-yellow-300" /></div>
              <p className="mt-3 text-sm text-violet-100">860 / 1200 XP · Next: Full Circuit</p>
            </section>
          </div>
        </aside>
        <section className="px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-violet-600 lg:hidden">⚡ The Switch Platform</p>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Yo Lloyd! ⚡</h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">You’re on a <strong className="text-violet-700">7 day streak</strong>. Keep the energy up!</p>
            </div>
            <a href="/login?reauth=1" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black shadow-sm hover:border-violet-300">Create account</a>
          </header>
          <section className="mt-7 grid gap-5 xl:grid-cols-[1.15fr_0.8fr_0.7fr_0.75fr]">
            <article className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-black text-violet-700">Continue Learning</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">Maths – Algebra</h2>
                  <p className="mt-3 text-sm text-slate-600">72% complete</p>
                  <div className="mt-3 h-2 w-44 overflow-hidden rounded-full bg-violet-100"><div className="h-full w-[72%] rounded-full bg-violet-600" /></div>
                  <a href="/subjects" className="mt-5 inline-flex rounded-2xl bg-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg hover:bg-violet-700">Continue →</a>
                </div>
                <div className="grid size-24 place-items-center rounded-full border-[10px] border-violet-200 text-2xl font-black text-violet-800 shadow-inner">72%</div>
              </div>
            </article>
            <article className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"><p className="text-sm font-black text-blue-700">Next Exam</p><h2 className="mt-4 text-2xl font-black">Maths Paper 1</h2><p className="mt-2 text-4xl font-black">18</p><p className="text-sm text-slate-600">days remaining</p><a href="/exams" className="mt-5 inline-flex rounded-2xl bg-blue-50 px-5 py-3 text-sm font-black text-blue-700 hover:bg-blue-100">View Exam →</a></article>
            <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"><p className="text-sm font-black text-emerald-700">Today’s Goal</p><p className="mt-4 text-5xl font-black">65%</p><p className="text-sm text-slate-600">of daily goal</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[65%] rounded-full bg-emerald-500" /></div></article>
            <article className="rounded-3xl bg-[#140062] p-6 text-white shadow-xl"><p className="text-sm font-black text-violet-100">Power Grid Progress</p><div className="mt-5 flex items-center gap-4"><span className="grid size-16 place-items-center rounded-3xl bg-violet-600 text-4xl shadow-lg">⚡</span><div><h2 className="text-2xl font-black">Voltage Rising</h2><p className="text-sm text-violet-100">Level 4 of 9</p></div></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-violet-900"><div className="h-full w-[44%] rounded-full bg-yellow-300" /></div></article>
          </section>
          <section className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div>
              <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-2xl font-black">Your Subjects</h2><a href="/subjects" className="rounded-2xl border border-violet-200 bg-white px-4 py-2 text-sm font-black text-violet-700 hover:bg-violet-50">View all subjects</a></div>
              <div className="grid gap-5 md:grid-cols-3">
                {subjects.map((subject) => (
                  <a key={subject.name} href="/subjects" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${subject.colour} text-2xl text-white shadow-lg`}>{subject.icon}</div>
                    <h3 className="mt-5 text-lg font-black">{subject.name}</h3><p className="mt-1 text-4xl font-black">{subject.progress}%</p><p className="text-sm text-slate-600">Overall Progress</p>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full bg-gradient-to-r ${subject.colour}`} style={{ width: `${subject.progress}%` }} /></div>
                    <span className={`mt-5 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r ${subject.colour} px-4 py-3 text-sm font-black text-white`}>Continue →</span>
                  </a>
                ))}
              </div>
            </div>
            <aside className="space-y-5">
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Weakest Topics</h2><div className="mt-5 space-y-5">{weakTopics.map((topic, index) => (<div key={topic.name}><div className="flex items-center justify-between text-sm font-black"><span className="flex items-center gap-3"><span className={`grid size-8 place-items-center rounded-full text-white ${topic.colour}`}>{index + 1}</span>{topic.name}</span><span>{topic.score}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`${topic.colour} h-full rounded-full`} style={{ width: `${topic.score}%` }} /></div></div>))}</div></article>
              <a href="/progress" className="block rounded-3xl bg-[#140062] p-6 text-white shadow-xl transition hover:-translate-y-1"><p className="text-sm font-black text-violet-100">✨ AI Recommendation</p><p className="mt-3 text-xl font-black">Focus on Probability to boost your grade.</p><span className="mt-5 inline-grid size-11 place-items-center rounded-full bg-violet-600 text-xl">→</span></a>
            </aside>
          </section>
          <section className="mt-7 rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Create your account ⚡</h2><p className="mt-1 text-sm text-slate-600">Sign up, complete onboarding, and unlock your personalised dashboard.</p>
            <div className="mt-5 flex flex-wrap gap-3"><a href="/login?reauth=1" className="rounded-2xl bg-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg hover:bg-violet-700">Sign up with Google or Microsoft</a><a href="/onboarding" className="rounded-2xl border border-violet-200 bg-white px-6 py-3 text-sm font-black text-violet-700 hover:bg-violet-50">Preview onboarding</a></div>
          </section>
        </section>
      </div>
    </main>
  );
}
