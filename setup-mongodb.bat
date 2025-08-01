@echo off
echo ========================================
echo Accio Component Generator Setup
echo ========================================
echo.

echo Checking if MongoDB is installed...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is not installed!
    echo.
    echo Please install MongoDB Community Server:
    echo 1. Go to: https://www.mongodb.com/try/download/community
    echo 2. Download and install MongoDB Community Server
    echo 3. Make sure MongoDB service is running
    echo.
    echo OR use MongoDB Atlas (cloud):
    echo 1. Go to: https://www.mongodb.com/atlas
    echo 2. Create free account and cluster
    echo 3. Update backend/.env with your connection string
    echo.
    pause
    exit /b 1
)

echo MongoDB is installed!
echo.

echo Starting MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo Warning: Could not start MongoDB service
    echo Please start MongoDB manually or check if it's already running
    echo.
)

echo Installing dependencies...
cd backend
npm install
cd ..

cd frontend
npm install
cd ..

echo.
echo Starting applications...
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.

start "Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Applications are starting...
echo Please wait a moment for them to fully load.
echo.
echo If you see any errors, make sure:
echo 1. MongoDB is running
echo 2. Ports 3000 and 5000 are available
echo 3. All dependencies are installed
echo.
pause 