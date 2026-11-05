Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Mexpo via Docker Compose (All Services)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
docker compose up -d
Write-Host ""
Write-Host "Services started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:3500/docs" -ForegroundColor Yellow
Write-Host "MinIO:    http://localhost:9001" -ForegroundColor Yellow

