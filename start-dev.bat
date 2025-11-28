@echo off
echo Starting Crypto Dashboard...
echo.

echo Starting backend server on port 3000...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting frontend server on port 3001...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3001
echo.
pause

