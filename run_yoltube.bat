@echo off
title YOLTube Auto Launcher
echo ==========================================
echo    YOLTube: AI YouTube Person Detector
echo ==========================================
echo.

:: 1. Python 서버 실행 (새 창으로)
echo [1/2] Starting Python Backend...
start cmd /k "cd server && pip install -r requirements.txt && python main.py"

:: 2. Expo 프론트엔드 실행
echo [2/2] Starting Expo Frontend...
echo Please wait a moment for the web page to open...
pnpm install && pnpm expo start --web

pause
