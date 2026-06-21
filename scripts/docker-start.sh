#!/bin/sh
set -e

if [ "$SWITCH_AUTO_BOOTSTRAP_SQLITE" = "1" ]; then
  node scripts/bootstrap-sqlite-if-missing.mjs
fi

exec npm start
