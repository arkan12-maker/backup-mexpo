@echo off
echo ========================================================
echo   Starting Mexpo via Docker Compose (All Services)
echo ========================================================
echo.
docker compose up -d
echo.
echo Services started!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3500/docs
echo MinIO:    http://localhost:9001
echo.
pause

