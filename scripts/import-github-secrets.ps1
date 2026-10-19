<#
.SYNOPSIS
    Automated script to import all Mexpo environment variables and AWS/ECR secrets to GitHub Repository Secrets.

.DESCRIPTION
    Runs the Node.js importer script (using Libsodium & GitHub REST API) or uses GitHub CLI (gh) to set secrets.
#>

param(
    [string]$GitHubToken = $env:GITHUB_TOKEN,
    [string]$PemKeyPath = ""
)

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   🚀 Mexpo GitHub Repository Secrets Importer" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# Check if Node.js is available
if (Get-Command node -ErrorAction SilentlyContinue) {
    if ($PemKeyPath -and (Test-Path $PemKeyPath)) {
        $env:EC2_SSH_KEY = Get-Content -Raw -Path $PemKeyPath
    }
    if ($GitHubToken) {
        $env:GITHUB_TOKEN = $GitHubToken
    }
    node scripts/import-github-secrets.mjs
}
elseif (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "Using GitHub CLI (gh) to set repository secrets..." -ForegroundColor Yellow
    
    # Reads all secrets directly from root .env

    if (Test-Path .env) {
        Get-Content .env | ForEach-Object {
            $line = $_.Trim()
            if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
                $parts = $line.Split("=", 2)
                $key = $parts[0].Trim()
                $val = $parts[1].Trim().Trim('"').Trim("'")
                if ($key -and $val) {
                    Write-Host "Setting $key..." -ForegroundColor Gray
                    gh secret set $key --body "$val"
                }
            }
        }
    }
    Write-Host "All secrets configured via gh CLI!" -ForegroundColor Green
}
else {
    Write-Error "Neither Node.js nor GitHub CLI (gh) was found. Please install Node.js."
}
