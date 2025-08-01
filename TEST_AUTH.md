# 🔍 Authentication Flow Test Guide

## 🐛 **Issue**: Registration redirects back to signup page

### **Steps to Test and Debug**

#### **1. Clear Browser Data**
```bash
# Clear all browser data for localhost:3000
# Or use incognito/private browsing mode
```

#### **2. Test Registration Flow**
1. **Open browser console** (F12)
2. **Go to** http://localhost:3000/register
3. **Check console logs** for:
   - "Register page - Current user: null"
   - "Register page - Current path: /register"

#### **3. Create Account**
1. **Enter email**: test@example.com
2. **Enter password**: password123
3. **Confirm password**: password123
4. **Click "Create Account"**
5. **Watch console logs** for:
   - "Attempting registration for: test@example.com"
   - "Registration successful: {message: 'User registered successfully...'}"
   - "Redirecting to login page..."

#### **4. Expected Behavior**
- ✅ **Success message** appears
- ✅ **Form clears** (email/password fields empty)
- ✅ **Automatic redirect** to /login after 2 seconds
- ✅ **Manual "Go to Login Now"** button works

#### **5. If Issues Persist**

##### **Check Browser Console**
Look for these error messages:
```
❌ "User already logged in, redirecting to dashboard"
❌ "Register page - Current user: {id: ..., email: ...}"
❌ Network errors (401, 500, etc.)
```

##### **Check Network Tab**
1. **Open DevTools** → Network tab
2. **Create account** and watch for:
   - POST /api/auth/register
   - Response status: 201
   - Response body: `{"message": "User registered successfully..."}`

##### **Check Local Storage**
1. **Open DevTools** → Application → Local Storage
2. **Should be empty** after registration
3. **Should contain** token and user after login

### **🔧 Quick Fixes**

#### **If stuck in redirect loop:**
1. **Clear browser data** completely
2. **Restart the application**:
   ```bash
   # Stop both servers (Ctrl+C)
   # Restart backend
   cd backend && npm start
   
   # Restart frontend (new terminal)
   cd frontend && npm run dev
   ```

#### **If user state persists:**
1. **Clear localStorage** manually:
   ```javascript
   // In browser console
   localStorage.clear();
   location.reload();
   ```

#### **If backend issues:**
1. **Check backend logs** for errors
2. **Verify MongoDB** is running
3. **Check .env file** is properly configured

### **📋 Debug Checklist**

- [ ] **Backend running** on port 5000
- [ ] **Frontend running** on port 3000
- [ ] **MongoDB connected** and working
- [ ] **Console logs** showing correct flow
- [ ] **Network requests** successful
- [ ] **Local storage** properly managed
- [ ] **Router navigation** working

### **🎯 Expected Flow**

```
1. User visits /register
   ↓
2. User fills form and submits
   ↓
3. Backend creates account (201 response)
   ↓
4. Frontend shows success message
   ↓
5. Form clears, user state cleared
   ↓
6. Automatic redirect to /login (2 seconds)
   ↓
7. User can now login with new account
```

### **🚨 Common Issues**

1. **User state not clearing**: Check setUser(null) call
2. **Router not working**: Check Next.js router configuration
3. **Backend errors**: Check server logs and MongoDB connection
4. **CORS issues**: Check backend CORS configuration
5. **Environment variables**: Check .env files are loaded

### **📞 Need Help?**

If the issue persists:
1. **Copy console logs** and share
2. **Check network tab** for failed requests
3. **Verify backend** is responding correctly
4. **Test with different browser** or incognito mode 