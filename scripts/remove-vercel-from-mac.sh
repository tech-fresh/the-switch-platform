#!/usr/bin/env bash
set -euo pipefail

echo "Stopping any Vercel CLI / dev processes..."
pkill -f "vercel dev" 2>/dev/null || true
pkill -f "node.*vercel" 2>/dev/null || true

echo "Removing Vercel CLI login and config..."
rm -rf "$HOME/Library/Application Support/com.vercel.cli"
rm -rf "$HOME/.config/vercel"
rm -f "$HOME/Library/Preferences/com.vercel.cli.plist"
rm -rf "$HOME/Library/Caches/com.vercel.cli"
rm -rf "$HOME/Library/Logs/vercel"

echo "Removing project link folders (.vercel)..."
find "$HOME/Documents" "$HOME/Projects" "$HOME/Developer" "$HOME/the-switch-platform" \
  -maxdepth 4 -name '.vercel' -type d 2>/dev/null | while read -r dir; do
  echo "  deleting $dir"
  rm -rf "$dir"
done

if command -v npm >/dev/null 2>&1; then
  echo "Uninstalling global Vercel CLI (if installed)..."
  npm uninstall -g vercel 2>/dev/null || true
fi

if command -v brew >/dev/null 2>&1; then
  echo "Uninstalling Vercel via Homebrew (if installed)..."
  brew uninstall vercel 2>/dev/null || true
fi

echo ""
echo "Done. Vercel CLI data removed from this Mac."
echo "Note: node_modules/@vercel inside Next.js projects were left alone (required by Next.js)."
echo "To verify nothing is running: ps aux | grep -i vercel"
