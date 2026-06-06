#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f dist/index.html ]; then
  if command -v npm >/dev/null 2>&1 && [ -f package.json ]; then
    echo "[LifeSim] dist/index.html not found, building frontend..."
    npm ci --prefer-offline --no-audit
    export MODELSCOPE=true
    npm run build
  else
    echo "[LifeSim] ERROR: dist/index.html is missing. Build locally or use Docker deployment." >&2
    exit 1
  fi
fi

exec python app.py
