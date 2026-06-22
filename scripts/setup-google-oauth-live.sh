#!/usr/bin/env bash
# Open Google OAuth client settings and print the exact URIs for The Switch live site.
# Does not require Homebrew. Optionally installs gcloud first.
#
# Usage:
#   bash scripts/setup-google-oauth-live.sh
#   bash scripts/setup-google-oauth-live.sh --install-gcloud

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.local"

read_env() {
  local key="$1"
  if [[ -f "${ENV_FILE}" ]]; then
    grep -E "^${key}=" "${ENV_FILE}" | tail -1 | cut -d= -f2- | tr -d '\r' || true
  fi
}

CLIENT_ID="$(read_env SWITCH_OIDC_GOOGLE_CLIENT_ID)"
AUTH_BASE_URL="$(read_env SWITCH_AUTH_BASE_URL)"
PROJECT_NUMBER="${GOOGLE_CLOUD_PROJECT_NUMBER:-280640969840}"

if [[ -z "${AUTH_BASE_URL}" ]]; then
  AUTH_BASE_URL="https://theswitchplatform.com"
fi

JS_ORIGIN="${AUTH_BASE_URL%/}"
REDIRECT_URI="${JS_ORIGIN}/api/auth/callback"

if [[ "${1:-}" == "--install-gcloud" ]]; then
  bash "${ROOT_DIR}/scripts/install-gcloud-macos.sh"
fi

GCLOUD_BIN=""
if command -v gcloud >/dev/null 2>&1; then
  GCLOUD_BIN="gcloud"
elif [[ -x "${HOME}/google-cloud-sdk/bin/gcloud" ]]; then
  GCLOUD_BIN="${HOME}/google-cloud-sdk/bin/gcloud"
  # shellcheck disable=SC1091
  source "${HOME}/google-cloud-sdk/path.zsh.inc" 2>/dev/null || true
fi

CONSOLE_URL="https://console.cloud.google.com/auth/clients/${CLIENT_ID}?project=${PROJECT_NUMBER}"

echo ""
echo "Google OAuth live setup for The Switch"
echo "======================================="
echo "Auth base URL:     ${JS_ORIGIN}"
echo "JavaScript origin: ${JS_ORIGIN}"
echo "Redirect URI:      ${REDIRECT_URI}"
echo ""
echo "Add BOTH values in Google Cloud Console if they are missing."
echo ""

if [[ -n "${GCLOUD_BIN}" ]]; then
  echo "gcloud found at: ${GCLOUD_BIN}"
  if ! "${GCLOUD_BIN}" auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | grep -q .; then
    echo "Starting Google login for gcloud (browser will open)..."
    "${GCLOUD_BIN}" auth login --brief
  fi
  ACTIVE_ACCOUNT="$("${GCLOUD_BIN}" auth list --filter=status:ACTIVE --format="value(account)" | head -1)"
  echo "Active gcloud account: ${ACTIVE_ACCOUNT:-none}"
else
  echo "gcloud not installed. Install without Homebrew:"
  echo "  bash scripts/install-gcloud-macos.sh"
fi

echo ""
echo "Opening OAuth client in your browser..."
if command -v open >/dev/null 2>&1; then
  open "${CONSOLE_URL}"
else
  echo "${CONSOLE_URL}"
fi

echo ""
echo "After saving in Google Console, test sign-in:"
echo "  ${JS_ORIGIN}/account"
echo ""
echo "Then run from the repo:"
echo "  npm run verify:google-oauth-live"
