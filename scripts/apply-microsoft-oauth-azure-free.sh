#!/usr/bin/env bash
# Option B: Azure free account + manual App registration → Fly secrets (no M365 Dev Program).
#
# Usage:
#   bash scripts/apply-microsoft-oauth-azure-free.sh
#   MICROSOFT_CLIENT_ID=uuid MICROSOFT_CLIENT_SECRET=secret bash scripts/apply-microsoft-oauth-azure-free.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.local"
FLY_APP="the-switch-platform"
REDIRECT_URI="https://theswitchplatform.com/api/auth/callback"
AUTH_URL="https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
TOKEN_URL="https://login.microsoftonline.com/common/oauth2/v2.0/token"
USERINFO_URL="https://graph.microsoft.com/oidc/userinfo"
SCOPES="openid profile email"

upsert_env() {
  local key="$1"
  local value="$2"
  if [[ -f "${ENV_FILE}" ]] && grep -q "^${key}=" "${ENV_FILE}"; then
    if [[ "$(uname)" == "Darwin" ]]; then
      sed -i '' "s|^${key}=.*|${key}=${value}|" "${ENV_FILE}"
    else
      sed -i "s|^${key}=.*|${key}=${value}|" "${ENV_FILE}"
    fi
  else
    echo "${key}=${value}" >> "${ENV_FILE}"
  fi
}

echo ""
echo "Microsoft OAuth — Azure free account (Option B)"
echo "==============================================="
echo ""
echo "Portal checklist (complete in browser first):"
echo "  1. https://azure.microsoft.com/free/ — sign up with your Microsoft account"
echo "  2. App registrations → New registration"
echo "     Name: The Switch Platform"
echo "     Account types: Multitenant + personal Microsoft accounts"
echo "     Redirect URI (Web): ${REDIRECT_URI}"
echo "  3. Copy Application (client) ID from Overview"
echo "  4. Certificates & secrets → New client secret → copy Value"
echo ""

if command -v open >/dev/null 2>&1; then
  open "https://azure.microsoft.com/free/"
  open "https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/CreateApplicationBlade/quickStartType~/null/isMSAApp~/false"
fi

CLIENT_ID="${MICROSOFT_CLIENT_ID:-${SWITCH_OIDC_MICROSOFT_CLIENT_ID:-}}"
CLIENT_SECRET="${MICROSOFT_CLIENT_SECRET:-${SWITCH_OIDC_MICROSOFT_CLIENT_SECRET:-}}"

if [[ -z "${CLIENT_ID}" ]]; then
  read -r -p "Paste Application (client) ID: " CLIENT_ID
fi
if [[ -z "${CLIENT_SECRET}" ]]; then
  read -r -s -p "Paste client secret value: " CLIENT_SECRET
  echo ""
fi

CLIENT_ID="$(echo "${CLIENT_ID}" | tr -d '[:space:]')"
CLIENT_SECRET="$(echo "${CLIENT_SECRET}" | tr -d '\r')"

if [[ ! "${CLIENT_ID}" =~ ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$ ]]; then
  echo "Client ID must be a UUID from Azure Overview — got: ${CLIENT_ID}"
  exit 1
fi

if [[ -z "${CLIENT_SECRET}" ]]; then
  echo "Client secret is required."
  exit 1
fi

if ! command -v fly >/dev/null 2>&1; then
  echo "Fly CLI not found."
  exit 1
fi

echo ""
echo "Setting Fly secrets on ${FLY_APP}..."
fly secrets set \
  "SWITCH_OIDC_MICROSOFT_CLIENT_ID=${CLIENT_ID}" \
  "SWITCH_OIDC_MICROSOFT_CLIENT_SECRET=${CLIENT_SECRET}" \
  "SWITCH_OIDC_MICROSOFT_AUTHORIZATION_URL=${AUTH_URL}" \
  "SWITCH_OIDC_MICROSOFT_TOKEN_URL=${TOKEN_URL}" \
  "SWITCH_OIDC_MICROSOFT_USERINFO_URL=${USERINFO_URL}" \
  "SWITCH_OIDC_MICROSOFT_SCOPES=${SCOPES}" \
  -a "${FLY_APP}"

touch "${ENV_FILE}"
upsert_env "SWITCH_LIVE_BASE_URL" "https://theswitchplatform.com"
upsert_env "SWITCH_AUTH_BASE_URL" "https://theswitchplatform.com"
upsert_env "SWITCH_OIDC_MICROSOFT_CLIENT_ID" "${CLIENT_ID}"
upsert_env "SWITCH_OIDC_MICROSOFT_CLIENT_SECRET" "${CLIENT_SECRET}"
upsert_env "SWITCH_OIDC_MICROSOFT_AUTHORIZATION_URL" "${AUTH_URL}"
upsert_env "SWITCH_OIDC_MICROSOFT_TOKEN_URL" "${TOKEN_URL}"
upsert_env "SWITCH_OIDC_MICROSOFT_USERINFO_URL" "${USERINFO_URL}"
upsert_env "SWITCH_OIDC_MICROSOFT_SCOPES" "${SCOPES}"

echo "Waiting 20s for Fly restart..."
sleep 20

cd "${ROOT_DIR}"
npm run verify:microsoft-oauth-live

echo ""
echo "Done. Test: https://theswitchplatform.com/login → Continue with Microsoft"
