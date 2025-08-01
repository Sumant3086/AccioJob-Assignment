@echo off
echo 🚀 Accio Component Generator - Deployment Guide
echo ================================================
echo.
echo 📋 Prerequisites:
echo 1. MongoDB Atlas account (free)
echo 2. Render account (free)
echo 3. Vercel account (free)
echo.
echo 🌐 Deployment Steps:
echo.
echo STEP 1: MongoDB Atlas Setup
echo ----------------------------
echo 1. Go to: https://mongodb.com/atlas
echo 2. Create free account
echo 3. Create new cluster (free tier)
echo 4. Get connection string
echo 5. Note your database URL
echo.
echo STEP 2: Deploy Backend to Render
echo --------------------------------
echo 1. Go to: https://render.com
echo 2. Sign up with GitHub
echo 3. Create new Web Service
echo 4. Connect repo: https://github.com/Sumant3086/AccioJob-Assignment.git
echo 5. Root Directory: backend
echo 6. Build Command: npm install
echo 7. Start Command: npm start
echo 8. Set environment variables (see below)
echo.
echo STEP 3: Deploy Frontend to Vercel
echo ---------------------------------
echo 1. Go to: https://vercel.com
echo 2. Sign up with GitHub
echo 3. Import repository
echo 4. Root Directory: frontend
echo 5. Set environment variable:
echo    NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
echo.
echo 📝 Environment Variables for Render:
echo ===================================
echo NODE_ENV=production
echo PORT=10000
echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/accio
echo JWT_SECRET=your-super-secret-production-jwt-key
echo FRONTEND_URL=https://your-frontend-domain.vercel.app
echo.
echo 📝 Environment Variable for Vercel:
echo ===================================
echo NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
echo.
echo 🎉 After deployment:
echo - Backend URL: https://your-backend.onrender.com
echo - Frontend URL: https://your-project.vercel.app
echo.
echo 📚 For detailed instructions, see DEPLOYMENT.md
echo.
pause 