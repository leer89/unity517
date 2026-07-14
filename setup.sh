#!/usr/bin/env bash
# Unity517 — first-time setup script (alternative to setup.ps1 if you have WSL/bash)
set -euo pipefail

echo "==> Cleaning any partial .git folder..."
rm -rf .git

echo "==> git init (main)..."
git init -b main >/dev/null
git remote add origin https://github.com/leer89/unity517.git

echo "==> npm install..."
npm install

echo "==> Staging + commit..."
git add .
git commit -m "Initial site: public homepage, hidden admin, Unity Fest seeded"

echo "==> Pushing to GitHub..."
git push -u origin main

echo ""
echo "✓ Done."
echo "  https://github.com/leer89/unity517"
