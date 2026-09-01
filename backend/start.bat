@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist .env (
    copy .env.example .env >nul
)
echo Installing dependencies...
py -m pip install -r requirements.txt
echo.
echo Starting backend on http://127.0.0.1:5000
echo Keep this window open while using the site.
echo.
py app.py
pause