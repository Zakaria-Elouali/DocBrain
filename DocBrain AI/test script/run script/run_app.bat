@echo off
echo Starting DocBrain AI...
echo.
echo The application will be available at http://127.0.0.1:8000
echo.
echo Press Ctrl+C to stop the application.
echo.

REM Set your API token here if you want to use the API
set HF_API_TOKEN=

REM Use local model if no API token is provided
if "%HF_API_TOKEN%"=="" (
    echo Using local model only.
    set USE_LOCAL_MODEL=true
) else (
    echo Using API with token: %HF_API_TOKEN%
    set USE_LOCAL_MODEL=false
)

REM Start the application
uvicorn app.main:app --reload
