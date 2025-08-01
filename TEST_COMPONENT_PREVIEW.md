# 🔍 Component Preview Test Guide

## 🐛 **Issue**: Navbar shows Button controls instead of Navbar controls

### **✅ FIXED**: Component detection logic improved

## **Steps to Test the Fix**

### **1. Clear Browser Data**
```bash
# Clear browser cache or use incognito mode
# This ensures fresh component state
```

### **2. Test Navbar Generation**
1. **Open browser console** (F12)
2. **Go to** http://localhost:3000
3. **Login** to your account
4. **Create a new session**
5. **Type this prompt**: "Build a responsive navigation bar"
6. **Click Send**

### **3. Check Console Logs**
You should see these logs:
```
ComponentPreview received: {
  jsx: "import React, { useState } from 'react';...",
  css: ".navbar { background: white;...",
  isCar: false,
  isButton: false,
  isNavbar: true,
  componentName: "Navbar"
}

Component type detection: {
  componentName: "Navbar",
  isButton: false,
  isCar: false,
  isCard: false,
  isNavbar: true,
  jsxSnippet: "import React, { useState } from 'react';..."
}

Creating Navbar component
```

### **4. Expected Behavior**
- ✅ **Navbar renders** in preview area (not a button)
- ✅ **Navbar controls** appear (Brand, Links inputs)
- ✅ **Button controls** do NOT appear
- ✅ **Component matches** the generated JSX code

### **5. Test Other Components**

#### **Test Car Component**
- **Prompt**: "Create a red sports car"
- **Expected**: Car controls (Model, Color, Speed)

#### **Test Button Component**
- **Prompt**: "Create a blue button"
- **Expected**: Button controls (Text, Variant, Size)

#### **Test Card Component**
- **Prompt**: "Create a product card"
- **Expected**: Card controls (Title, Content, Show Image)

## **🔧 Debugging**

### **If Navbar Still Shows Button Controls**

#### **Check Console Logs**
Look for these patterns:
```
❌ "Creating Button component" (should be "Creating Navbar component")
❌ isButton: true (should be false)
❌ isNavbar: false (should be true)
```

#### **Check JSX Content**
The JSX should contain:
```jsx
const Navbar = ({ brand, links }) => {
  // ... navbar code
}
```

#### **Check CSS Classes**
The CSS should contain:
```css
.navbar { ... }
.navbar-brand { ... }
.navbar-menu { ... }
```

### **If Component Doesn't Render**

#### **Check Network Tab**
1. **Open DevTools** → Network tab
2. **Generate component** and watch for:
   - POST /api/ai/generate
   - Response status: 200
   - Response contains jsx and css

#### **Check Component State**
1. **Open DevTools** → Console
2. **Type**: `console.log('Current component state:', componentState)`
3. **Should show**: Empty object `{}` for new components

## **🎯 Expected Results**

### **Navbar Component**
- **Preview**: Shows navigation bar with brand and menu links
- **Controls**: Brand input, Links input
- **No**: Text, Variant, Size controls

### **Car Component**
- **Preview**: Shows visual car with wheels and body
- **Controls**: Model, Color, Speed
- **No**: Button-specific controls

### **Button Component**
- **Preview**: Shows clickable button
- **Controls**: Text, Variant, Size
- **No**: Navbar/Car controls

## **🚨 Common Issues**

1. **Component state not resetting**: Check setComponentState({}) call
2. **Detection logic failing**: Check console logs for detection results
3. **CSS not applying**: Check if CSS is properly injected
4. **Controls not updating**: Check event listener registration

## **📞 Need Help?**

If the issue persists:
1. **Copy console logs** and share
2. **Check network tab** for failed requests
3. **Verify JSX/CSS** content is correct
4. **Test with different component types**

## **🎉 Success Indicators**

- ✅ **Correct component** renders in preview
- ✅ **Correct controls** appear for component type
- ✅ **Console logs** show correct detection
- ✅ **State updates** work when using controls
- ✅ **CSS styling** applies correctly 