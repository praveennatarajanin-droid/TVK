@echo off
title TVK CM Portal - Governance & News Hub Launcher
echo ==========================================================
echo    TAMILAGA VETTRI KAZHAGAM - CM THALAPATHY VIJAY PORTAL
echo                 State-of-the-Art News Portal
echo ==========================================================
echo.
echo Launching your fully dynamic state-of-the-art political portal...
echo.

:: Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% equ 0 (
    echo Node.js environment detected! Starting Express REST API Server...
    echo.
    echo Syncing dependencies...
    call npm install --no-audit --no-fund
    echo.
    echo Server starting at: http://localhost:8000
    echo Press Ctrl+C in this terminal window to stop the server.
    echo.
    start http://localhost:8000
    node server.js
) else (
    echo.
    echo WARNING: Node.js was not detected on this system!
    echo Node.js is required for server-side persistence, the auto-news
    echo aggregator, and the citizen grievances inbox features.
    echo.
    :: Fallback to Python simple HTTP server (local client-only offline mock)
    python -V >nul 2>&1
    if %errorlevel% equ 0 (
        echo Python detected! Launching in client-only offline mode...
        echo Hosting offline site at: http://localhost:8000
        start http://localhost:8000
        python -m http.server 8000
    ) else (
        echo Opening index.html directly in browser (Local Offline mode)...
        start "" "index.html"
    )
)
pause
