# Unity517 — first-time setup script (run from C:\Users\prefe\Desktop\unity)
# Usage:
#   1. Open PowerShell in this folder (Shift+Right-click → "Open PowerShell window here")
#   2. Run:  .\setup.ps1
#
# What it does:
#   - Cleans the half-initialized .git folder my sandbox left behind
#   - Initializes git on `main` and wires up the github.com/leer89/unity517 remote
#   - Installs npm dependencies
#   - Stages, commits, and pushes the initial code

$ErrorActionPreference = "Stop"

Write-Host "==> Cleaning any partial .git folder..." -ForegroundColor Cyan
if (Test-Path ".git") {
  Remove-Item -Recurse -Force ".git"
}

Write-Host "==> git init (main)..." -ForegroundColor Cyan
git init -b main | Out-Null
git config user.name  (git config --global user.name)
git config user.email (git config --global user.email)
git remote add origin https://github.com/leer89/unity517.git

Write-Host "==> npm install (this takes ~1-2 min)..." -ForegroundColor Cyan
npm install

Write-Host "==> Staging + commit..." -ForegroundColor Cyan
git add .
git commit -m "Initial site: public homepage, hidden admin, Unity Fest seeded"

Write-Host "==> Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "    If prompted, sign in with your GitHub account (browser will open)." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "✓ Done." -ForegroundColor Green
Write-Host "  View on GitHub:  https://github.com/leer89/unity517"
Write-Host "  Run locally:     npm run dev   (then open http://localhost:3000)"
Write-Host "  Deploy steps:    see DEPLOY.md"
