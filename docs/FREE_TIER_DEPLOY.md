# Free-tier deploy — Fly.io with persistent SQLite

Use this when **Vercel cannot redeploy** (tokens exhausted) or **Vercel Blob is suspended** and you still need a durable live site for **Final Path Mark 2**.

No repo code changes are required beyond this folder. The app already supports filesystem SQLite.

## Why Fly.io

| Host | Durable disk on free/cheap tier | Works with this repo today |
|------|----------------------------------|----------------------------|
| **Fly.io** | Yes — attach a 1 GB volume (~$0.15/mo) | Yes — `fly.toml` + `Dockerfile` in repo |
| Vercel serverless | No — needs Blob (yours is suspended) | Blocked |
| Render | Disk needs paid Starter ($7/mo) | Env-only, no blueprint in repo |

Fly’s shared VM can sleep when idle (cold start). Student data stays on the volume.

## What you need (15–30 minutes)

1. Free [Fly.io](https://fly.io) account + [flyctl](https://fly.io/docs/hands-on/install-flyctl/)
2. Auth secrets from your old Vercel project (you can **copy env vars without redeploying**)
3. Google (or other) OIDC app — add the new Fly URL as redirect URI

## Step 1 — Install flyctl

```bash
brew install flyctl
fly auth login
```

## Step 2 — Create app + volume

From this repo root:

```bash
cd "/Users/lloydnwagbara/Documents/THE SWITCH 3"
fly launch --no-deploy --copy-config --name the-switch-platform
fly volumes create switch_data --size 1 --region lhr
```

If the app name is taken, pick another name and update `app = '...'` in `fly.toml`.

## Step 3 — Set secrets (copy from Vercel)

Copy auth and governance values from Vercel → Settings → Environment Variables.

Minimum set (see `docs/free-tier-secrets.example`):

```bash
fly secrets set \
  SWITCH_AUTH_MODE=oidc \
  SWITCH_AUTH_SECRET='your-long-secret' \
  SWITCH_AUTH_BASE_URL='https://the-switch-platform.fly.dev' \
  SWITCH_OIDC_GOOGLE_CLIENT_ID='...' \
  SWITCH_OIDC_GOOGLE_CLIENT_SECRET='...' \
  SWITCH_OIDC_GOOGLE_AUTHORIZATION_URL='https://accounts.google.com/o/oauth2/v2/auth' \
  SWITCH_OIDC_GOOGLE_TOKEN_URL='https://oauth2.googleapis.com/token' \
  SWITCH_OIDC_GOOGLE_USERINFO_URL='https://openidconnect.googleapis.com/v1/userinfo'
```

Or import a file:

```bash
fly secrets import < docs/free-tier-secrets.local   # copy from docs/free-tier-secrets.example
```

**Important:** set `SWITCH_AUTH_BASE_URL` to your real Fly URL (`https://<app>.fly.dev`).

In Google Cloud Console → OAuth client → add authorized redirect URI:

```text
https://<app>.fly.dev/api/auth/callback/google
```

(Exact path depends on your auth routes — match what Vercel used, but swap the host.)

## Step 4 — Deploy

```bash
fly deploy
```

First boot runs `scripts/bootstrap-sqlite-if-missing.mjs` (via `SWITCH_AUTO_BOOTSTRAP_SQLITE=1` in `fly.toml`) and creates `/data/switch-live.sqlite` on the volume.

Check logs:

```bash
fly logs
```

## Step 5 — Verify from your machine

Create or update `.env.local` with the **Fly** URL (not Vercel):

```bash
SWITCH_LIVE_BASE_URL=https://the-switch-platform.fly.dev
SWITCH_AUTH_BASE_URL=https://the-switch-platform.fly.dev
SWITCH_PERSISTENCE_DRIVER=sqlite
SWITCH_DATA_DIRECTORY=/data
SWITCH_AUTH_MODE=oidc
# ... same OIDC + governance vars as production ...
SWITCH_LIVE_STUDENT_COOKIE=...
SWITCH_LIVE_ADMIN_COOKIE=...
```

Run:

```bash
npm run verify:persistence-health
npm run verify:launch-status
npm run verify:live-readiness
npm run verify:persistence-recovery
npm run verify:live-walkthrough
npm run verify:launch-signoff
npm run verify:launch-complete
npm run verify:live-truth-match
```

`verify:persistence-health` replaces `verify:blob-health` when not using Vercel Blob.

## Step 6 — Point your domain (optional)

```bash
fly certs add theswitchplatform.com
```

Update DNS CNAME to Fly. Then update `SWITCH_AUTH_BASE_URL`, `SWITCH_LIVE_BASE_URL`, and OIDC redirect URIs again.

## Manual re-seed (if needed)

```bash
fly ssh console -C "cd /app && SWITCH_PERSISTENCE_DRIVER=sqlite SWITCH_DATA_DIRECTORY=/data npm run persistence:migrate-to-sqlite"
```

## Cost note

- Fly shared VM: often within free allowance; may bill a few dollars if always-on
- 1 GB volume: about **$0.15/month**
- Still far cheaper than fixing suspended Vercel Blob when you cannot redeploy

## What does NOT count as launch complete

- Leaving production on suspended Vercel Blob
- Using `local-json`, `memory`, or `/tmp` SQLite on serverless
- Skipping `verify:live-truth-match` against the **new** live URL

## After Fly is healthy

Update `HANDOFF.md` Live session state with the new base URL and close item 22 when `verify:live-truth-match` passes.
