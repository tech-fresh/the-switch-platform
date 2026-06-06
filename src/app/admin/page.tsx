import { getCmsOverview } from "@/modules/cms/service";
import { getPastPaperCatalogOverview } from "@/modules/past-papers/service";

function getSyncClasses(status: "healthy" | "warning" | "planned"): string {
  if (status === "healthy") {
    return "border-emerald-300 bg-emerald-50 text-emerald-950";
  }

  if (status === "warning") {
    return "border-amber-300 bg-amber-50 text-amber-950";
  }

  return "border-stone-300 bg-stone-50 text-stone-800";
}

export default async function AdminPage() {
  const [cms, papers] = await Promise.all([
    getCmsOverview(),
    getPastPaperCatalogOverview(),
  ]);

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Admin + Content Architecture
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Planned content and past-paper update architecture for the full product.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This route is still an MVP admin placeholder, but it now exposes the real
                architecture for how the website will receive updated learning content and where
                past-paper metadata and future links will come from.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Content items</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{cms.content.length}</p>
              <p className="mt-1 text-sm text-stone-600">{cms.publishedCount} published in the seed layer</p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Paper catalog</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{papers.papers.length}</p>
              <p className="mt-1 text-sm text-stone-600">{papers.metadataOnlyCount} metadata-only so far</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Content update architecture
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  How the website will receive updated learning content
                </h2>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {cms.providers.map((provider) => (
                  <article key={provider.providerId} className="border border-stone-200 bg-stone-50 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getSyncClasses(provider.syncStatus)}`}>
                        {provider.syncStatus}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-stone-500">{provider.type}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-stone-950">{provider.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{provider.description}</p>
                    <p className="mt-3 text-sm text-stone-700">{provider.nextStep}</p>
                  </article>
                ))}
              </div>
              <div className="mt-5 border border-dashed border-stone-300 bg-stone-50 p-4 text-sm leading-7 text-stone-700">
                {cms.nextUpdatePlan}
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Past paper sourcing
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Where updated past papers will come from
                </h2>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {papers.providers.map((provider) => (
                  <article key={provider.providerId} className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{provider.type}</p>
                    <h3 className="mt-3 text-lg font-semibold text-stone-950">{provider.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{provider.description}</p>
                    <p className="mt-3 text-sm text-stone-700">Update cadence: {provider.updateCadence}</p>
                    <p className="mt-2 text-sm text-stone-700">{provider.nextStep}</p>
                  </article>
                ))}
              </div>
              <div className="mt-5 border border-dashed border-stone-300 bg-stone-50 p-4 text-sm leading-7 text-stone-700">
                {papers.nextUpdatePlan}
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What is true right now
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>Student content still comes from seeded module data inside the repo.</li>
                <li>Past papers currently have architecture and metadata, not live external ingestion.</li>
                <li>The provider boundaries are now explicit, so we can add real sources without rewriting routes.</li>
              </ul>
            </section>

            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this route proves
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>Content update architecture now exists in code, not only in planning notes.</li>
                <li>Past paper sourcing has provider boundaries before external integrations are added.</li>
                <li>Website and future app clients can later consume the same CMS and paper catalogs through API routes.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
