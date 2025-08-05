@echo off
echo Installing DocBrain AI dependencies...
echo.

REM Check if conda is available
where conda >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Conda not found. Using pip...
    pip install -r requirements.txt
) else (
    echo Conda found. Would you like to:
    echo 1. Create a new conda environment from environment.yml (recommended)
    echo 2. Install dependencies with pip in current environment
    echo 3. Exit

    set /p choice="Enter your choice (1-3): "

    if "%choice%"=="1" (
        echo Creating conda environment from environment.yml...
        conda env create -f environment.yml

        echo.
        echo Environment created successfully!
        echo.
        echo To activate this environment, use:
        echo conda activate docbrainLlama
        echo.
        echo Then run the application with:
        echo uvicorn app.main:app --reload
    ) else if "%choice%"=="2" (
        echo Installing dependencies with pip...
        pip install -r requirements.txt

        echo.
        echo Dependencies installed!
        echo.
        echo You can now run the application with:
        echo uvicorn app.main:app --reload
    ) else (
        echo Installation cancelled.
        exit /b 0
    )
)

echo.
echo Installation completed!
echo.
pause
