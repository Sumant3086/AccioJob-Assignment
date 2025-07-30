# 🚀 Deployment Guide

This guide will help you deploy the AI Component Generator Platform to production.

## 📋 Prerequisites

1. **GitHub Account** - For code repository
2. **Heroku Account** - For backend deployment
3. **Vercel Account** - For frontend deployment
4. **MongoDB Atlas** - For database (free tier available)
5. **Redis Cloud** - For caching (free tier available)
6. **OpenRouter Account** - For AI API access

## 🔧 Step 1: Prepare Your Environment

### 1.1 Get API Keys
- **OpenRouter API Key**: Sign up at [openrouter.ai](https://openrouter.ai)
- **MongoDB URI**: Create cluster at [MongoDB Atlas](https://mongodb.com/atlas)
- **Redis URL**: Create database at [Redis Cloud](https://redis.com/try-free/)

### 1.2 Update Environment Variables
Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-component-generator
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
OPENROUTER_API_KEY=sk-proj-your-openrouter-api-key
REDIS_URL=redis://username:password@host:port
```

## 🚀 Step 2: Deploy Backend to Heroku

### 2.1 Install Heroku CLI
```bash
# Windows
winget install --id=Heroku.HerokuCLI

# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2.2 Login to Heroku
```bash
heroku login
```

### 2.3 Create Heroku App
```bash
cd backend
heroku create your-app-name
```

### 2.4 Add Buildpacks
```bash
heroku buildpacks:add heroku/nodejs
```

### 2.5 Set Environment Variables
```bash
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set OPENROUTER_API_KEY="your-openrouter-api-key"
heroku config:set REDIS_URL="your-redis-url"
```

### 2.6 Deploy Backend
```bash
git add .
git commit -m "Deploy backend"
git push heroku main
```

### 2.7 Verify Deployment
```bash
heroku logs --tail
```

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 3.2 Login to Vercel
```bash
vercel login
```

### 3.3 Update API URL
Edit `frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-app-name.herokuapp.com/api/:path*"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-app-name.herokuapp.com"
  }
}
```

### 3.4 Deploy Frontend
```bash
cd frontend
vercel --prod
```

## 🔍 Step 4: Verify Deployment

### 4.1 Test Backend API
```bash
curl https://your-app-name.herokuapp.com/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 4.2 Test Frontend
Visit your Vercel URL and test:
- User registration
- User login
- Session creation
- Component generation
- Code export

## 🛠️ Step 5: Monitoring & Maintenance

### 5.1 Heroku Monitoring
```bash
# View logs
heroku logs --tail

# Monitor dyno usage
heroku ps

# Check app status
heroku status
```

### 5.2 Vercel Monitoring
- Visit your Vercel dashboard
- Check deployment status
- Monitor performance

### 5.3 Database Monitoring
- MongoDB Atlas dashboard
- Redis Cloud dashboard

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend Deployment Fails
```bash
# Check logs
heroku logs --tail

# Common fixes:
# - Ensure all dependencies are in package.json
# - Check environment variables
# - Verify MongoDB connection
```

#### 2. Frontend Can't Connect to Backend
```bash
# Check CORS settings
# Verify API URL in vercel.json
# Test backend endpoint directly
```

#### 3. AI Generation Not Working
```bash
# Check OpenRouter API key
# Verify API key format
# Check API usage limits
```

#### 4. Redis Connection Issues
```bash
# Check Redis URL format
# Verify Redis credentials
# Test Redis connection locally
```

## 📊 Performance Optimization

### 1. Enable Redis Caching
- Session data caching
- API response caching
- User data caching

### 2. Database Optimization
- Index frequently queried fields
- Use connection pooling
- Monitor query performance

### 3. Frontend Optimization
- Enable Next.js caching
- Optimize bundle size
- Use CDN for static assets

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use strong JWT secrets
- Rotate API keys regularly

### 2. API Security
- Implement rate limiting
- Add request validation
- Use HTTPS only

### 3. Database Security
- Use strong passwords
- Enable network access controls
- Regular backups

## 📈 Scaling Considerations

### 1. Horizontal Scaling
- Multiple Heroku dynos
- Load balancing
- Database clustering

### 2. Vertical Scaling
- Upgrade dyno size
- Increase database capacity
- Add more Redis memory

### 3. Cost Optimization
- Monitor usage
- Use free tiers where possible
- Optimize resource usage

## 🎯 Production Checklist

- [ ] Backend deployed to Heroku
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Database connected and tested
- [ ] Redis connected and tested
- [ ] AI API working
- [ ] Authentication working
- [ ] Component generation working
- [ ] Code export working
- [ ] Monitoring set up
- [ ] Error handling tested
- [ ] Performance optimized
- [ ] Security measures in place

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section
2. Review Heroku and Vercel documentation
3. Check application logs
4. Verify environment variables
5. Test locally first

## 🎉 Success!

Once deployed, your AI Component Generator Platform will be live and accessible to users worldwide!

**Live Demo URL**: https://your-frontend-url.vercel.app
**Backend API**: https://your-backend-url.herokuapp.com 