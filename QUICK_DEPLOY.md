# 🚀 Quick Deployment Guide

## ✅ Backend Successfully Deployed!

**Backend URL**: https://acciojob-assignment-30a6.onrender.com

## 🔧 Fix MongoDB Connection

### Step 1: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster (free tier)
4. Get connection string

### Step 2: Update Render Environment Variables
Go to your Render dashboard → Environment → Add these variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/accio
JWT_SECRET=your-super-secret-production-jwt-key-change-this
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## 🚀 Deploy Frontend to Vercel

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Import Repository
1. Select: `https://github.com/Sumant3086/AccioJob-Assignment.git`
2. Set **Root Directory**: `frontend`
3. Set **Framework Preset**: Next.js

### Step 3: Configure Environment
Add this environment variable:
```env
NEXT_PUBLIC_API_URL=https://acciojob-assignment-30a6.onrender.com
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Get your frontend URL

## 🎉 Final URLs

- **Backend**: https://acciojob-assignment-30a6.onrender.com
- **Frontend**: https://your-project.vercel.app (after Vercel deployment)

## 🔗 Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://mongodb.com/atlas

## 📝 Environment Variables Summary

**For Render (Backend)**:
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/accio
JWT_SECRET=your-super-secret-production-jwt-key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

**For Vercel (Frontend)**:
```env
NEXT_PUBLIC_API_URL=https://acciojob-assignment-30a6.onrender.com
```

## 🚨 Important Notes

1. **MongoDB Atlas**: Required for production database
2. **JWT Secret**: Change to a strong random string
3. **Frontend URL**: Update after Vercel deployment
4. **CORS**: Backend will accept requests from your Vercel domain

## 🎯 Next Steps

1. ✅ Backend deployed to Render
2. 🔄 Set up MongoDB Atlas
3. 🔄 Update Render environment variables
4. 🔄 Deploy frontend to Vercel
5. ✅ Update frontend environment variables
6. 🎉 Test the live application 