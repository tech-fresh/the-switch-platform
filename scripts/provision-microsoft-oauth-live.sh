#!/usr/bin/env bash
# Create Azure App registration + Fly secrets for Microsoft sign-in on the live site.
#
# Prerequisites: Azure CLI (`az`), Fly CLI (`fly`), M365 Developer tenant (az login).
#
# Usage:
#   bash scripts/provision-microsoft-oauth-live.sh
#   npm run provision:microsoft-oauth-live

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.local"

APP_NAME="The Switch Platform"
REDIRECT_URI="https://theswitchplatform.com/api/auth/callback"
FLY_APP="the-switch-platform"
AUTH_URL="https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
TOKEN_URL="https://login.microsoftonline.com/common/oauth2/v2.0/token"
USERINFO_URL="https://graph.microsoft.com/oidc/userinfo"
SCOPES="openid profile email"

AZ="${AZ:-az}"
if ! command -v "${AZ}" >/dev/null 2>&1; then
  echo "Azure CLI not found. Install with: brew install azure-cli"
  exit 1
fi

if ! command -v fly >/dev/null 2>&1; then
  echo "Fly CLI not found. Install from https://fly.io/docs/flyctl/install/"
  exit 1
fi

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
echo "Microsoft OAuth live provision (Azure + Fly)"
echo "============================================="
echo "Redirect URI: ${REDIRECT_URI}"
echo ""

if [[ "${SKIP_AZ_LOGIN:-0}" != "1" ]]; then
  if ! "${AZ}" account show >/dev/null 2>&1; then
    echo "Azure login required. Complete the device-code sign-in in your browser."
    echo ""
    echo "IMPORTANT: sign in with your M365 Developer TENANT admin account, e.g.:"
    echo "  admin@yourtenant.onmicrosoft.com"
    echo "Do NOT use a personal @hotmail.com account with no directory."
    echo ""
    "${AZ}" login --use-device-code --allow-no-subscriptions
  fi
fi

if ! "${AZ}" ad signed-in-user show >/dev/null 2>&1; then
  echo ""
  echo "Azure CLI is not connected to a directory/tenant."
  echo "Join the M365 Developer Program, then sign in with admin@<tenant>.onmicrosoft.com"
  echo "from the welcome email — not theswitchplatform@hotmail.com alone."
  exit 1
fi

TENANT="$("${AZ}" account show --query tenantId -o tsv)"
USER="$("${AZ}" account show --query user.name -o tsv)"
echo "Signed in as: ${USER}"
echo "Tenant ID:    ${TENANT}"
echo ""

EXISTING_ID="$("${AZ}" ad app list --display-name "${APP_NAME}" --query "[0].appId" -o tsv 2>/dev/null || true)"
if [[ -n "${EXISTING_ID}" && "${EXISTING_ID}" != "null" ]]; then
  CLIENT_ID="${EXISTING_ID}"
  echo "Found existing app registration: ${CLIENT_ID}"
  "${AZ}" ad app update \
    --id "${CLIENT_ID}" \
    --sign-in-audience AzureADandPersonalMicrosoftAccount \
    --web-redirect-uris "${REDIRECT_URI}" >/dev/null
  echo "Updated redirect URI and personal-account support."
else
  echo "Creating Azure app registration..."
  CLIENT_ID="$("${AZ}" ad app create \
    --display-name "${APP_NAME}" \
    --sign-in-audience AzureADandPersonalMicrosoftAccount \
    --web-redirect-uris "${REDIRECT_URI}" \
    --query appId -o tsv)"
  echo "Created app registration: ${CLIENT_ID}"
fi

echo "Creating client secret (valid 2 years)..."
CLIENT_SECRET="$("${AZ}" ad app credential reset --id "${CLIENT_ID}" --append --years 2 --query password -o tsv)"

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

echo ""
echo "Updating ${ENV_FILE} for local verify scripts..."
touch "${ENV_FILE}"
upsert_env "SWITCH_LIVE_BASE_URL" "https://theswitchplatform.com"
upsert_env "SWITCH_AUTH_BASE_URL" "https://theswitchplatform.com"
upsert_env "SWITCH_OIDC_MICROSOFT_CLIENT_ID" "${CLIENT_ID}"
upsert_env "SWITCH_OIDC_MICROSOFT_CLIENT_SECRET" "${CLIENT_SECRET}"
upsert_env "SWITCH_OIDC_MICROSOFT_AUTHORIZATION_URL" "${AUTH_URL}"
upsert_env "SWITCH_OIDC_MICROSOFT_TOKEN_URL" "${TOKEN_URL}"
upsert_env "SWITCH_OIDC_MICROSOFT_USERINFO_URL" "${USERINFO_URL}"
upsert_env "SWITCH_OIDC_MICROSOFT_SCOPES" "${SCOPES}"

echo ""
echo "Waiting 20s for Fly to restart with new secrets..."
sleep 20

echo ""
echo "Running live verification..."
cd "${ROOT_DIR}"
npm run verify:microsoft-oauth-live

echo ""
echo "Done."
echo "Client ID: ${CLIENT_ID}"
echo "Test sign-in: https://theswitchplatform.com/login"
