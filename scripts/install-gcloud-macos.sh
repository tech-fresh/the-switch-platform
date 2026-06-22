#!/usr/bin/env bash
# Install Google Cloud CLI on macOS without Homebrew.
# Usage: bash scripts/install-gcloud-macos.sh

set -euo pipefail

INSTALL_DIR="${GCLOUD_INSTALL_DIR:-$HOME/google-cloud-sdk}"
ARCH="$(uname -m)"
OS="$(uname -s)"

if [[ "${OS}" != "Darwin" ]]; then
  echo "This installer supports macOS only."
  exit 1
fi

case "${ARCH}" in
  arm64|aarch64) GCLOUD_ARCHIVE="google-cloud-cli-darwin-arm.tar.gz" ;;
  x86_64) GCLOUD_ARCHIVE="google-cloud-cli-darwin-x86_64.tar.gz" ;;
  *)
    echo "Unsupported architecture: ${ARCH}"
    exit 1
    ;;
esac

DOWNLOAD_URL="https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/${GCLOUD_ARCHIVE}"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

echo "Downloading ${GCLOUD_ARCHIVE}..."
curl -fsSL "${DOWNLOAD_URL}" -o "${TMP_DIR}/${GCLOUD_ARCHIVE}"

echo "Installing to ${INSTALL_DIR}..."
mkdir -p "$(dirname "${INSTALL_DIR}")"
tar -xzf "${TMP_DIR}/${GCLOUD_ARCHIVE}" -C "$(dirname "${INSTALL_DIR}")"

if [[ ! -x "${INSTALL_DIR}/bin/gcloud" ]]; then
  echo "Install failed: gcloud binary not found at ${INSTALL_DIR}/bin/gcloud"
  exit 1
fi

"${INSTALL_DIR}/install.sh" --quiet --path-update true --command-completion true --usage-reporting false

echo ""
echo "Google Cloud CLI installed."
echo "Restart your terminal, or run:"
echo "  source \"${INSTALL_DIR}/path.zsh.inc\""
echo "  source \"${INSTALL_DIR}/path.bash.inc\""
echo "  gcloud version"
