@echo off
echo ========================================
echo 🚀 AI Component Generator Platform
echo ========================================
echo.

echo 📋 Checking prerequisites...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed
echo.

REM Check if MongoDB is running (optional)
echo 🔍 Checking MongoDB connection...
curl -s http://localhost:27017 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB is running locally
) else (
    echo ⚠️  MongoDB is not running locally
    echo    Make sure MongoDB is installed and running, or use MongoDB Atlas
    echo    Download MongoDB: https://www.mongodb.com/try/download/community
    echo    Or use MongoDB Atlas: https://www.mongodb.com/atlas
    echo.
)

echo.
echo 🔧 Setting up environment files...
echo.

REM Create backend .env file if it doesn't exist
if not exist "backend\.env" (
    echo 📝 Creating backend .env file...
    copy "backend\env.example" "backend\.env"
    echo ✅ Backend .env file created
    echo    ⚠️  Please update backend\.env with your configuration
) else (
    echo ✅ Backend .env file already exists
)

REM Create frontend .env.local file if it doesn't exist
if not exist "frontend\.env.local" (
    echo 📝 Creating frontend .env.local file...
    copy "frontend\env.example" "frontend\.env.local"
    echo ✅ Frontend .env.local file created
    echo    ⚠️  Please update frontend\.env.local with your configuration
) else (
    echo ✅ Frontend .env.local file already exists
)

echo.
echo 📦 Installing dependencies...
echo.

REM Install backend dependencies
echo 🔧 Installing backend dependencies...
cd backend
if not exist "node_modules" (
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Backend dependencies already installed
)
cd ..

REM Install frontend dependencies
echo 🔧 Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Frontend dependencies already installed
)
cd ..

echo.
echo 🚀 Starting the application...
echo.

REM Start backend server
echo 🔧 Starting backend server...
start "Backend Server" cmd /k "cd backend && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo 🔧 Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo ✅ Application is starting up!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo.
echo 📋 Next steps:
echo    1. Open http://localhost:3000 in your browser
echo    2. Create a new account or sign in
echo    3. Start generating components!
echo.
echo 💡 Tips:
echo    - Make sure MongoDB is running
echo    - Update .env files with your API keys for real AI
echo    - Check the console for any error messages
echo.
echo 🔒 Security Note:
echo    - Never commit .env files to Git
echo    - Keep your API keys secure
echo    - Use strong passwords
echo.
pause 