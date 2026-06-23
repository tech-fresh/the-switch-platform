#!/usr/bin/env bash
# Point theswitchplatform.com DNS on Cloudflare from Vercel to Fly.io
#
# Prerequisites:
#   1. Cloudflare API token with "Zone → DNS → Edit" for theswitchplatform.com
#      Create at: https://dash.cloudflare.com/profile/api-tokens
#   2. jq installed: brew install jq
#
# Usage:
#   export CF_API_TOKEN='your-token-here'
#   bash scripts/cloudflare-point-domain-to-fly.sh

set -euo pipefail

ZONE_NAME="${ZONE_NAME:-theswitchplatform.com}"
FLY_A="${FLY_A:-66.241.125.88}"
FLY_AAAA="${FLY_AAAA:-2a09:8280:1::131:4d1c:0}"
VERCEL_CNAME_TARGET="${VERCEL_CNAME_TARGET:-373d521b11725192.vercel-dns-017.com}"

if [[ -z "${CF_API_TOKEN:-}" ]]; then
  echo "Error: set CF_API_TOKEN first."
  echo "  export CF_API_TOKEN='your-cloudflare-dns-edit-token'"
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required. Install with: brew install jq"
  exit 1
fi

api() {
  curl -sS -X "$1" "https://api.cloudflare.com/client/v4$2" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    ${3:+--data "$3"}
}

echo "Looking up Cloudflare zone ID for ${ZONE_NAME}..."
ZONE_ID="$(api GET "/zones?name=${ZONE_NAME}" | jq -r '.result[0].id // empty')"
if [[ -z "${ZONE_ID}" || "${ZONE_ID}" == "null" ]]; then
  echo "Error: zone not found or token lacks access."
  exit 1
fi
echo "Zone ID: ${ZONE_ID}"

echo ""
echo "Deleting Vercel CNAME records..."
mapfile -t DELETE_IDS < <(
  api GET "/zones/${ZONE_ID}/dns_records?per_page=100" \
    | jq -r --arg target "${VERCEL_CNAME_TARGET}" \
      '.result[] | select(.type=="CNAME" and (.content==$target or (.content|test("vercel-dns")))) | .id'
)

if ((${#DELETE_IDS[@]} == 0)); then
  echo "No Vercel CNAME records found (may already be removed)."
else
  for record_id in "${DELETE_IDS[@]}"; do
    name="$(api GET "/zones/${ZONE_ID}/dns_records/${record_id}" | jq -r '.result.name')"
    echo "  Deleting CNAME ${name} (${record_id})"
    api DELETE "/zones/${ZONE_ID}/dns_records/${record_id}" >/dev/null
  done
fi

upsert_record() {
  local type="$1"
  local name="$2"
  local content="$3"

  local existing_id
  existing_id="$(api GET "/zones/${ZONE_ID}/dns_records?type=${type}&name=${name}" \
    | jq -r '.result[0].id // empty')"

  local payload
  payload="$(jq -n \
    --arg type "${type}" \
    --arg name "${name}" \
    --arg content "${content}" \
    '{type:$type,name:$name,content:$content,ttl:1,proxied:false}')"

  if [[ -n "${existing_id}" && "${existing_id}" != "null" ]]; then
    echo "  Updating ${type} ${name} -> ${content}"
    api PUT "/zones/${ZONE_ID}/dns_records/${existing_id}" "${payload}" >/dev/null
  else
    echo "  Creating ${type} ${name} -> ${content}"
    api POST "/zones/${ZONE_ID}/dns_records" "${payload}" >/dev/null
  fi
}

echo ""
echo "Creating Fly DNS records (DNS only / not proxied)..."
upsert_record "A" "${ZONE_NAME}" "${FLY_A}"
upsert_record "AAAA" "${ZONE_NAME}" "${FLY_AAAA}"
upsert_record "A" "www.${ZONE_NAME}" "${FLY_A}"
upsert_record "AAAA" "www.${ZONE_NAME}" "${FLY_AAAA}"

echo ""
echo "Done. Current A/AAAA records:"
api GET "/zones/${ZONE_ID}/dns_records?type=A" | jq -r '.result[] | "A  \(.name) -> \(.content)"'
api GET "/zones/${ZONE_ID}/dns_records?type=AAAA" | jq -r '.result[] | "AAAA \(.name) -> \(.content)"'

echo ""
echo "Wait 5-15 minutes, then run:"
echo "  dig +short ${ZONE_NAME} A"
echo "  dig +short ${ZONE_NAME} AAAA"
echo "  fly certs check ${ZONE_NAME} -a the-switch-platform"
