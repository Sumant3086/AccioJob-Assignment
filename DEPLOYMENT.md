# 🚀 Deployment Guide

This guide covers deploying the AI Component Generator Platform to various hosting platforms.

## 📋 Prerequisites

Before deployment, ensure you have:
- [ ] MongoDB database (local or cloud)
- [ ] Git repository with your code
- [ ] Environment variables configured
- [ ] Domain name (optional but recommended)

## 🌐 Platform Options

### 1. **Vercel + Render** (Recommended)
- **Frontend**: Vercel (Next.js optimized)
- **Backend**: Render (Node.js hosting)
- **Database**: MongoDB Atlas (cloud database)

### 2. **Netlify + Heroku**
- **Frontend**: Netlify
- **Backend**: Heroku
- **Database**: MongoDB Atlas

### 3. **AWS (Full Stack)**
- **Frontend**: AWS Amplify
- **Backend**: AWS EC2 or Lambda
- **Database**: MongoDB Atlas or AWS DocumentDB

## 🚀 Deployment Steps

### Option 1: Vercel + Render (Recommended)

#### Step 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   ```bash
   # Connect your GitHub repository
   # Select the backend folder
   ```

3. **Configure Service**
   - **Name**: `accio-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

4. **Set Environment Variables**
   ```env
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/accio
   JWT_SECRET=your-super-secret-production-jwt-key
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the service URL (e.g., `https://accio-backend.onrender.com`)

#### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   ```bash
   # Connect your GitHub repository
   # Select the frontend folder
   ```

3. **Configure Project**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. **Set Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://accio-backend.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-project.vercel.app`

### Option 2: Heroku + Netlify

#### Step 1: Deploy Backend to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create accio-backend
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/accio
   heroku config:set JWT_SECRET=your-super-secret-production-jwt-key
   heroku config:set FRONTEND_URL=https://your-frontend-domain.netlify.app
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

#### Step 2: Deploy Frontend to Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Import Project**
   - Connect your GitHub repository
   - Select the frontend folder

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

4. **Set Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://accio-backend.herokuapp.com
   ```

5. **Deploy**
   - Click "Deploy site"
   - Your app will be available at `https://your-project.netlify.app`

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Choose free tier (M0)
   - Select cloud provider and region
   - Click "Create"

3. **Configure Network Access**
   - Go to "Network Access"
   - Add IP address: `0.0.0.0/0` (allow all)
   - Or add specific IPs for security

4. **Create Database User**
   - Go to "Database Access"
   - Create new user with read/write permissions
   - Note username and password

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your user password

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/accio
JWT_SECRET=your-super-secret-production-jwt-key-change-this
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## 🔒 Security Checklist

### Before Deployment
- [ ] Change JWT_SECRET to a strong random string
- [ ] Set up HTTPS (automatic on Vercel/Netlify/Heroku)
- [ ] Configure CORS with your frontend domain
- [ ] Set up environment variables
- [ ] Test authentication flow
- [ ] Verify database connection

### Production Security
- [ ] Use strong passwords for database
- [ ] Enable MongoDB Atlas security features
- [ ] Set up proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting (optional)
- [ ] Set up monitoring and logging

## 🧪 Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-backend-domain.com/health
```

### 2. Authentication Flow
- [ ] Register new user
- [ ] Login with credentials
- [ ] Verify session persistence
- [ ] Test logout functionality

### 3. Component Generation
- [ ] Create new session
- [ ] Generate component via chat
- [ ] Verify live preview
- [ ] Test code export

### 4. Session Management
- [ ] Create multiple sessions
- [ ] Switch between sessions
- [ ] Verify data persistence
- [ ] Test auto-save functionality

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```bash
   # Check FRONTEND_URL in backend environment
   # Ensure it matches your frontend domain exactly
   ```

2. **Database Connection**
   ```bash
   # Verify MONGODB_URI format
   # Check network access in MongoDB Atlas
   # Ensure username/password are correct
   ```

3. **Build Failures**
   ```bash
   # Check Node.js version compatibility
   # Verify all dependencies are in package.json
   # Check for TypeScript errors
   ```

4. **Environment Variables**
   ```bash
   # Ensure all variables are set in hosting platform
   # Check for typos in variable names
   # Verify values are correct
   ```

### Debug Commands

```bash
# Check backend logs
heroku logs --tail  # Heroku
# Or check Render/Netlify dashboard

# Test API endpoints
curl -X POST https://your-backend.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Check frontend build
npm run build
```

## 📊 Performance Optimization

### Backend
- [ ] Enable Redis caching (optional)
- [ ] Set up database indexes
- [ ] Implement rate limiting
- [ ] Add compression middleware

### Frontend
- [ ] Optimize images
- [ ] Enable Next.js optimizations
- [ ] Set up CDN (automatic on Vercel/Netlify)
- [ ] Implement lazy loading

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          # Add your deployment commands here

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          # Add your deployment commands here
```

## 📈 Monitoring

### Recommended Tools
- **Backend**: Render/Heroku built-in monitoring
- **Frontend**: Vercel/Netlify analytics
- **Database**: MongoDB Atlas monitoring
- **Errors**: Sentry (optional)

### Key Metrics to Monitor
- Response times
- Error rates
- Database connection status
- Memory usage
- User activity

## 🎯 Final Checklist

### Before Going Live
- [ ] All environment variables set
- [ ] Database connected and tested
- [ ] Authentication working
- [ ] Component generation functional
- [ ] Export functionality working
- [ ] Mobile responsiveness tested
- [ ] Error handling implemented
- [ ] Security measures in place

### Post-Launch
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Test user flows
- [ ] Verify data persistence
- [ ] Update documentation

---

**Your AI Component Generator Platform is now live! 🎉**

**Live Demo**: [Your deployed URL]
**GitHub Repository**: [Your repo URL] 