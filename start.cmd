@echo off
cd /d "%~dp0"
if exist ".tools\node-v22.14.0-win-x64\node.exe" set "PATH=%CD%\.tools\node-v22.14.0-win-x64;%PATH%"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22 or later from https://nodejs.org then run this file again.
  pause
  exit /b 1
)
if not exist node_modules call npm ci
if errorlevel 1 (
  pause
  exit /b 1
)
call npm run dev
pause
