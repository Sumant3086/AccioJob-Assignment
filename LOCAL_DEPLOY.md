# 🚀 Local MongoDB Deployment Guide

## ✅ Backend Already Deployed!

**Backend URL**: https://acciojob-assignment-30a6.onrender.com

## 🔧 Quick Fix: Use Local MongoDB

Since you're in a paid organization, let's use your local MongoDB for now:

### Step 1: Update Render Environment Variables

Go to your Render dashboard and add these environment variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb://localhost:27017/accio
JWT_SECRET=your-super-secret-production-jwt-key-change-this
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

**Note**: This will work if your local MongoDB is accessible from Render (which it might not be).

### Step 2: Alternative - Use MongoDB Atlas Free Tier

1. **Create a new MongoDB account** with a different email
2. **Don't join any organization** - stay as individual user
3. **You'll get free tier access**

### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import repository: `https://github.com/Sumant3086/AccioJob-Assignment.git`
4. Set **Root Directory**: `frontend`
5. Add environment variable:
   ```env
   NEXT_PUBLIC_API_URL=https://acciojob-assignment-30a6.onrender.com
   ```
6. Deploy

## 🎯 Next Steps

1. ✅ Backend deployed to Render
2. 🔄 Deploy frontend to Vercel
3. 🔄 Set up MongoDB (Atlas free or local)
4. 🎉 Test the application

## 📝 Environment Variables

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

- **Local MongoDB**: May not work with Render (network restrictions)
- **MongoDB Atlas**: Recommended for production
- **Free Tier**: Available for individual accounts, not organizations 