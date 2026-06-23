#!/usr/bin/env bash
# Open Microsoft Entra app registration guidance and print the exact redirect URI
# for The Switch live site.
#
# Usage:
#   bash scripts/setup-microsoft-oauth-live.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.local"

read_env() {
  local key="$1"
  if [[ -f "${ENV_FILE}" ]]; then
    grep -E "^${key}=" "${ENV_FILE}" | tail -1 | cut -d= -f2- | tr -d '\r' || true
  fi
}

CLIENT_ID="$(read_env SWITCH_OIDC_MICROSOFT_CLIENT_ID)"
AUTH_BASE_URL="$(read_env SWITCH_AUTH_BASE_URL)"

if [[ -z "${AUTH_BASE_URL}" ]]; then
  AUTH_BASE_URL="https://theswitchplatform.com"
fi

REDIRECT_URI="${AUTH_BASE_URL%/}/api/auth/callback"
PORTAL_URL="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade"

echo ""
echo "Microsoft OAuth live setup for The Switch"
echo "=========================================="
echo "Auth base URL:  ${AUTH_BASE_URL%/}"
echo "Redirect URI:   ${REDIRECT_URI}"
echo ""
echo "Azure App Registration checklist:"
echo "  1. Create or open an App registration"
echo "  2. Authentication → Add a platform → Web"
echo "  3. Redirect URI: ${REDIRECT_URI}"
echo "  4. Copy Application (client) ID → SWITCH_OIDC_MICROSOFT_CLIENT_ID"
echo "  5. Create a client secret → SWITCH_OIDC_MICROSOFT_CLIENT_SECRET"
echo "  6. Use these default OIDC URLs in .env.local / Fly secrets:"
echo "       SWITCH_OIDC_MICROSOFT_AUTHORIZATION_URL=https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
echo "       SWITCH_OIDC_MICROSOFT_TOKEN_URL=https://login.microsoftonline.com/common/oauth2/v2.0/token"
echo "       SWITCH_OIDC_MICROSOFT_USERINFO_URL=https://graph.microsoft.com/oidc/userinfo"
echo "       SWITCH_OIDC_MICROSOFT_SCOPES=openid profile email"
echo ""

if [[ -n "${CLIENT_ID}" ]]; then
  echo "Detected client ID in .env.local: ${CLIENT_ID}"
  PORTAL_URL="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Authentication/appId/${CLIENT_ID}"
else
  echo "No SWITCH_OIDC_MICROSOFT_CLIENT_ID found in .env.local yet."
fi

echo ""
echo "Opening Azure Portal..."
if command -v open >/dev/null 2>&1; then
  open "${PORTAL_URL}"
else
  echo "${PORTAL_URL}"
fi

echo ""
echo "After saving in Azure, test sign-in:"
echo "  ${AUTH_BASE_URL%/}/login"
echo ""
echo "Then run from the repo:"
echo "  npm run verify:microsoft-oauth-live"
