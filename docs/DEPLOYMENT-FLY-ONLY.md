# Deployment Policy — Fly.io Only

> **Status:** authoritative — **6 July 2026**  
> **Live production:** https://theswitchplatform.com  
> **Deploy command:** `npm run deploy:fly` (or `fly deploy -a the-switch-platform`)

Plain English: **The Switch runs on Fly.io only.** Do not deploy to Netlify, Vercel, Render, or other hosts unless the operator explicitly reopens a migration project and updates this document first.

---

## Non-negotiable rules

| Rule | Detail |
|------|--------|
| **Production host** | **Fly.io** — `fly.toml`, `Dockerfile`, volume `/data` |
| **Persistence** | `SWITCH_PERSISTENCE_DRIVER=sqlite` + `SWITCH_DATA_DIRECTORY=/data` on Fly volume |
| **Do not use Netlify** | No `netlify.toml`, no Netlify deploy previews, no Netlify DNS as production target |
| **Do not use Vercel** | No Vercel project deploys, no Vercel Blob persistence, no `.vercel` project links for production |
| **Do not add alternate CI deploys** | GitHub checks from Netlify/Vercel should be **disconnected** (see operator cleanup below) |
| **Agents** | Never suggest Vercel/Netlify as deployment path; extend Fly stack only |

Historical records in `README.md` Ordered Build Record that mention Vercel Blob or Netlify are **archived context only** — not current deployment truth.

---

## Operator cleanup — disconnect retired hosts on GitHub

If PR checks still show **Netlify** or **Vercel** failures, remove the integrations from the GitHub repo (repo files alone cannot disable installed GitHub Apps):

1. Open https://github.com/tech-fresh/the-switch-platform/settings/installations  
2. **Configure** Netlify → remove this repository or uninstall  
3. **Configure** Vercel → remove this repository or uninstall  
4. Optional: Settings → Branches → `main` branch protection → remove Netlify/Vercel from required checks if still listed  

After disconnecting, only Fly-relevant checks (or repo `npm run test` CI if added) should run on pull requests.

---

## How to deploy (production)

```bash
npm run lint && npm run type-check && npm run test
npm run build
npm run deploy:fly
curl -I https://theswitchplatform.com
```

Full provisioning guide: [`docs/FREE_TIER_DEPLOY.md`](./FREE_TIER_DEPLOY.md)

---

## Local and rehearsal

| Environment | Path |
|-------------|------|
| Local dev | `npm run dev` — `.next` cache |
| Local production rehearsal | `npm run build` → `.next-rehearsal` → `npm run start` |
| Fly production | `fly deploy` — volume at `/data` |

---

## What stays in the repo (and why)

| Item | Reason |
|------|--------|
| `scripts/remove-vercel-from-mac.sh` | Operator utility to clean local Vercel CLI — not a deploy path |
| `scripts/cloudflare-point-domain-to-fly.sh` | DNS migration helper (mentions Vercel CNAME removal) |
| `VERCEL` env detection in `persistence/runtime.ts` | Generic serverless-runtime guard — **not** an endorsement of Vercel hosting |

Do not reintroduce `netlify.toml`, `vercel.json`, or Vercel Blob persistence adapters.

---

## Related documents

| Document | Role |
|----------|------|
| [`PLATFORM-GUIDE.md`](../PLATFORM-GUIDE.md) | Architecture + session rules |
| [`AGENTS.md`](../AGENTS.md) | Agent entry — Fly-only note |
| [`HANDOFF.md`](../HANDOFF.md) | Live session state |
| [`FINAL_LAUNCH_RUNBOOK.md`](../FINAL_LAUNCH_RUNBOOK.md) | Live verification (Fly path) |
| [`docs/FREE_TIER_DEPLOY.md`](./FREE_TIER_DEPLOY.md) | Fly provisioning steps |
