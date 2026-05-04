@echo off
echo ==========================================
echo NILM Platform Environment Setup
echo ==========================================

echo [1/4] Creating virtual environment...
python -m venv venv

echo [2/4] Activating environment...
call venv\Scripts\activate

echo [3/4] Installing dependencies (this may take a few minutes)...
pip install -r requirements.txt

echo [4/4] Environment ready! 
echo.
echo To start the server, run:
echo venv\Scripts\python server.py
echo.
pause
