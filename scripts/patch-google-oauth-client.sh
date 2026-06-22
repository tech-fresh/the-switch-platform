#!/usr/bin/env bash
# Patch Google OAuth client redirect URIs using gcloud auth (no Homebrew).
# Requires: gcloud logged in with permission to edit OAuth clients in project 280640969840
#
# Usage:
#   bash scripts/patch-google-oauth-client.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.local"

read_env() {
  local key="$1"
  if [[ -f "${ENV_FILE}" ]]; then
    grep -E "^${key}=" "${ENV_FILE}" | tail -1 | cut -d= -f2- | tr -d '\r' || true
  fi
}

PROJECT_NUMBER="${GOOGLE_CLOUD_PROJECT_NUMBER:-280640969840}"
CLIENT_ID="$(read_env SWITCH_OIDC_GOOGLE_CLIENT_ID)"
AUTH_BASE_URL="$(read_env SWITCH_AUTH_BASE_URL)"
AUTH_BASE_URL="${AUTH_BASE_URL:-https://theswitchplatform.com}"
JS_ORIGIN="${AUTH_BASE_URL%/}"
REDIRECT_URI="${JS_ORIGIN}/api/auth/callback"

if [[ -x "${HOME}/google-cloud-sdk/bin/gcloud" ]]; then
  GCLOUD="${HOME}/google-cloud-sdk/bin/gcloud"
elif command -v gcloud >/dev/null 2>&1; then
  GCLOUD="gcloud"
else
  echo "gcloud not found. Run: npm run install:gcloud-macos"
  exit 1
fi

if ! "${GCLOUD}" auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
  echo "Starting gcloud login..."
  "${GCLOUD}" auth login --brief
fi

"${GCLOUD}" config set project "${PROJECT_NUMBER}" >/dev/null

TOKEN="$("${GCLOUD}" auth print-access-token)"
CLIENT_RESOURCE="projects/${PROJECT_NUMBER}/locations/global/oauthClients/${CLIENT_ID}"

TMP_JSON="$(mktemp)"
trap 'rm -f "${TMP_JSON}"' EXIT

HTTP_CODE="$(curl -sS -o "${TMP_JSON}" -w "%{http_code}" \
  -H "Authorization: Bearer ${TOKEN}" \
  "https://iam.googleapis.com/v1/${CLIENT_RESOURCE}")"

if [[ "${HTTP_CODE}" != "200" ]]; then
  echo "Could not read OAuth client via Google API (HTTP ${HTTP_CODE})."
  echo "Use the browser helper instead:"
  echo "  npm run setup:google-oauth-live"
  echo ""
  echo "Add manually if needed:"
  echo "  JavaScript origin: ${JS_ORIGIN}"
  echo "  Redirect URI:      ${REDIRECT_URI}"
  cat "${TMP_JSON}" 2>/dev/null || true
  exit 1
fi

node "${ROOT_DIR}/scripts/patch-google-oauth-client.mjs" "${TMP_JSON}" "${JS_ORIGIN}" "${REDIRECT_URI}" "${CLIENT_RESOURCE}" "${TOKEN}"

echo ""
echo "Verify:"
echo "  npm run verify:google-oauth-live"
