#!/usr/bin/env bash
set -euo pipefail

echo "=== Recipe Manager — Install ==="
echo "Installing dependencies..."
npm install --no-audit --no-fund

echo ""
echo "=== Setup complete ==="
echo "Run the app: npm run dev"
echo "The app will seed demo recipes on first load."
