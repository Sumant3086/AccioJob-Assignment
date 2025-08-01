# 🚀 AI Component Generator Platform

A stateful, AI-driven micro-frontend playground where authenticated users can iteratively generate, preview, tweak, and export React components with all chat history and code edits preserved across logins.

## ✨ Features

### 🎯 Core Features
- **🔐 Authentication**: Secure signup/login with JWT
- **💬 Interactive Chat**: AI-powered component generation
- **👁️ Live Preview**: Real-time component rendering
- **📝 Code Editor**: Syntax-highlighted JSX/CSS tabs
- **💾 Session Management**: Save and load previous work
- **📦 Export**: Download components as ZIP files

### 🎨 Component Types
- **🚗 Cars**: Visual car components with customization
- **🔘 Buttons**: Interactive buttons with variants
- **🃏 Cards**: Content cards with images
- **🧭 Navigation**: Responsive navigation bars

### 🔄 Iterative Refinement
- **Live Controls**: Modify component properties in real-time
- **Chat Refinement**: "Make it larger", "Change to red", etc.
- **State Persistence**: All changes saved automatically

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **OpenAI/OpenRouter** for AI integration

### Frontend
- **React** with Next.js
- **Tailwind CSS** for styling
- **Axios** for API calls
- **JSZip** for file downloads

### AI Integration
- **Real AI**: OpenAI GPT-4o-mini / OpenRouter
- **Mock AI**: Fallback for development
- **Context Awareness**: Understands existing components

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd Accio
```

### 2. Run the Setup Script
```bash
# Windows
start.bat

# Or manually:
# 1. Copy environment files
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env.local

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Start servers
cd ../backend && npm start
cd ../frontend && npm run dev
```

### 3. Configure Environment
Update the environment files with your settings:

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/accio-components
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key  # Optional
OPENROUTER_API_KEY=your-openrouter-api-key  # Optional
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 🎯 Usage Guide

### Creating Components
1. **Sign up/Login** to your account
2. **Create a new session** or load existing one
3. **Type prompts** like:
   - "Create a red sports car"
   - "Make a blue button with rounded corners"
   - "Generate a navigation bar"

### Iterative Refinement
1. **Use live controls** to modify properties
2. **Chat refinement**:
   - "Make it larger"
   - "Change the color to blue"
   - "Add rounded corners"

### Exporting Components
1. **Copy code** using the copy button
2. **Download ZIP** for complete project files
3. **Use in your projects** immediately

## 🔒 Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Email validation
- Session management

### Data Protection
- Environment variables for secrets
- CORS configuration
- Input validation
- Error handling without sensitive data

### API Security
- Rate limiting
- Token verification
- Secure headers
- HTTPS enforcement in production

## 📁 Project Structure

```
Accio/
├── backend/
│   ├── config/          # Database and Redis config
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── frontend/
│   ├── components/      # React components
│   ├── pages/          # Next.js pages
│   ├── styles/         # Global styles
│   └── public/         # Static assets
├── SECURITY.md         # Security checklist
├── DEPLOYMENT.md       # Deployment guide
└── start.bat          # Setup script
```

## 🚀 Deployment

### Backend Deployment
- **Render**: Easy deployment with environment variables
- **Heroku**: Support for Node.js apps
- **Railway**: Modern deployment platform

### Frontend Deployment
- **Vercel**: Optimized for Next.js
- **Netlify**: Static site hosting
- **GitHub Pages**: Free hosting option

### Database
- **MongoDB Atlas**: Cloud database service
- **Local MongoDB**: For development

## 🔧 Configuration

### Environment Variables

**Required:**
- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: Secret key for JWT tokens

**Optional:**
- `OPENAI_API_KEY`: For real AI integration
- `OPENROUTER_API_KEY`: Alternative AI provider
- `REDIS_URL`: For caching (optional)

### AI Integration
The platform works with or without AI API keys:
- **With API keys**: Real AI responses
- **Without API keys**: Mock AI fallback

## 🐛 Troubleshooting

### Common Issues

**1. Authentication Errors (401)**
- Clear browser storage
- Check JWT_SECRET in .env
- Verify MongoDB connection

**2. Component Not Rendering**
- Check browser console for errors
- Verify backend is running
- Check API endpoints

**3. AI Not Working**
- Verify API keys in .env
- Check API quota/limits
- Mock AI will work as fallback

### Debug Mode
Enable debug logging:
```env
NODE_ENV=development
DEBUG=true
```

## 📈 Performance

### Optimization
- **Lazy loading** of components
- **Caching** with Redis (optional)
- **Compression** middleware
- **CDN** for static assets

### Monitoring
- **Health checks** endpoint
- **Error logging**
- **Performance metrics**

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Development Setup
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for AI integration
- **MongoDB** for database
- **Vercel** for deployment
- **Tailwind CSS** for styling

## 📞 Support

- **Issues**: Create a GitHub issue
- **Documentation**: Check the docs folder
- **Security**: Report to security@example.com

---

**Made with ❤️ for the AI Component Generator Platform** 