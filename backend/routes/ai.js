// backend/routes/ai.js

const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const auth = require("../middleware/auth");
const axios = require("axios");
const multer = require("multer");

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Real AI Integration (OpenAI/OpenRouter)
const generateWithRealAI = async (prompt, context = null, imageBuffer = null) => {
  try {
    // Try OpenAI first
    if (process.env.OPENAI_API_KEY) {
      const messages = [
        {
          role: "system",
          content: `You are an expert React component generator with a conversational, helpful personality like ChatGPT. Create modern, responsive React components based on user descriptions.

IMPORTANT RULES:
1. ALWAYS return a valid JSON object with 'jsx' and 'css' properties
2. The JSX should be a complete, functional React component
3. CSS should be comprehensive and modern
4. Understand user intent - if they ask for a "red button", create a button with red styling
5. If they ask for "navigation bar", create a proper navbar component
6. If they ask for "card", create a card with image, title, and content
7. Make components interactive and visually appealing
8. Be conversational and helpful in your responses

Component Types to Generate:
- Button: Interactive buttons with hover effects
- Card: Content cards with images, titles, descriptions
- Navbar: Navigation bars with links and mobile responsiveness
- Car: Visual car components with wheels, body, and details
- Form: Login/signup forms with proper validation

${context ? 'This is an iterative refinement. Modify the existing component based on the user request while preserving its core structure.' : 'Create a new component based on the user description.'}`
        }
      ];

      if (context) {
        messages.push({
          role: "user",
          content: `Current component:\nJSX: ${context.jsx}\nCSS: ${context.css}\n\nUser request: ${prompt}\n\nModify the component according to the user's request. Return only valid JSON with jsx and css properties.`
        });
      } else {
        messages.push({
          role: "user",
          content: `Create a React component for: "${prompt}". 

Examples of what to generate:
- "red button" → Button with red background and white text
- "navigation bar" → Responsive navbar with links
- "card with image" → Card component with image, title, content
- "car component" → Visual car with wheels and body
- "login form" → Form with email/password fields

Return only valid JSON with jsx and css properties.`
        });
      }

      const requestBody = {
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      };

      // Add image if provided
      if (imageBuffer) {
        requestBody.messages[1].content = [
          {
            type: "text",
            text: `Create a React component based on this image: ${prompt || 'Generate a component based on this image'}. Return only valid JSON with jsx and css properties.`
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
            }
          }
        ];
      }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      const content = response.data.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        if (parsed.jsx && parsed.css) {
          return parsed;
        }
      } catch (e) {
        console.log("Failed to parse OpenAI response as JSON, using fallback");
      }
    }

    // Try OpenRouter as fallback
    if (process.env.OPENROUTER_API_KEY) {
      const messages = [
        {
          role: "system",
          content: `You are a React component generator with a conversational personality. Generate ONLY valid React JSX components with CSS styling. 
          Return a JSON object with 'jsx' and 'css' properties. The JSX should be a complete React component.
          Make components modern, responsive, and well-styled. Be helpful and conversational in your responses.
          
          ${context ? 'This is an iterative refinement. Modify the existing component based on the user request.' : ''}`
        }
      ];

      if (context) {
        messages.push({
          role: "user",
          content: `Current component:\nJSX: ${context.jsx}\nCSS: ${context.css}\n\nUser request: ${prompt}\n\nModify the component according to the user's request. Return only valid JSON with jsx and css properties.`
        });
      } else {
        messages.push({
          role: "user",
          content: `Create a React component for: "${prompt}". Return only valid JSON with jsx and css properties.`
        });
      }

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://your-app.com",
            "X-Title": "Accio Component Generator"
          },
        }
      );

      const content = response.data.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        if (parsed.jsx && parsed.css) {
          return parsed;
        }
      } catch (e) {
        console.log("Failed to parse OpenRouter response as JSON, using fallback");
      }
    }

    // Fallback to mock components
    console.log("Using mock components as fallback");
    return generateComponent(prompt, context);
  } catch (error) {
    console.error("Error in generateWithRealAI:", error);
    return generateComponent(prompt, context);
  }
};

// Mock AI response for development (fallback)
const generateComponent = async (prompt, context = null) => {
  // Try real AI first
  try {
    return await generateWithRealAI(prompt, context);
  } catch (error) {
    console.log("Using mock AI fallback:", error.message);
  }

  // Fallback to mock responses with iterative refinement
  const components = {
    button: {
      jsx: `import React from 'react';

const Button = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;`,
      css: `.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}`
    },
    form: {
      jsx: `import React, { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;`,
      css: `.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
}`
    },
    car: {
      jsx: `import React from 'react';

const Car = ({ model, color = 'red', speed = 'fast' }) => {
  return (
    <div className="car">
      <div className="car-body">
        <div className="car-top"></div>
        <div className="car-bottom">
          <div className="car-wheel car-wheel-front"></div>
          <div className="car-wheel car-wheel-back"></div>
        </div>
      </div>
      <div className="car-details">
        <h3 className="car-model">{model || 'Sports Car'}</h3>
        <p className="car-specs">Color: {color} | Speed: {speed}</p>
      </div>
    </div>
  );
};

export default Car;`,
      css: `.car {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.car-body {
  position: relative;
  width: 200px;
  height: 80px;
  background: linear-gradient(45deg, #ff4444, #cc0000);
  border-radius: 40px 40px 20px 20px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.car-top {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 40px;
  background: linear-gradient(45deg, #ff6666, #ff4444);
  border-radius: 20px 20px 0 0;
  border: 2px solid #cc0000;
}

.car-bottom {
  position: relative;
  width: 100%;
  height: 100%;
}

.car-wheel {
  position: absolute;
  bottom: -15px;
  width: 30px;
  height: 30px;
  background: #333;
  border-radius: 50%;
  border: 3px solid #666;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.5);
}

.car-wheel-front {
  left: 20px;
}

.car-wheel-back {
  right: 20px;
}

.car-details {
  text-align: center;
}

.car-model {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.car-specs {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* Car variants */
.car.sports {
  transform: scale(1.1);
}

.car.luxury .car-body {
  background: linear-gradient(45deg, #gold, #ffd700);
}

.car.electric .car-body {
  background: linear-gradient(45deg, #00ff00, #00cc00);
}`
    },
    card: {
      jsx: `import React from 'react';

const Card = ({ title, content, image }) => {
  return (
    <div className="card">
      {image && (
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-text">{content}</p>
      </div>
    </div>
  );
};

export default Card;`,
      css: `.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.card-text {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}`
    },
    navbar: {
      jsx: `import React, { useState } from 'react';

const Navbar = ({ brand, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">{brand}</span>
        <button 
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <div className={\`navbar-menu \${isOpen ? 'is-open' : ''}\`}>
        {links.map((link, index) => (
          <a key={index} href={link.url} className="navbar-link">
            {link.text}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;`,
      css: `.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
}

.navbar-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.navbar-toggle span {
  width: 25px;
  height: 3px;
  background: #374151;
  margin: 2px 0;
  transition: 0.3s;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.navbar-link {
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  transition: color 0.2s ease;
}

.navbar-link:hover {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .navbar-toggle {
    display: flex;
  }
  
  .navbar-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .navbar-menu.is-open {
    display: flex;
  }
}`
    }
  };

  // Enhanced prompt matching for new components
  const promptLower = prompt.toLowerCase();
  
  // Check if this is a request for a completely new component type
  const isNewComponentRequest = (prompt) => {
    const newComponentKeywords = ['create', 'make', 'build', 'generate', 'new', 'show', 'display'];
    const componentTypes = ['car', 'vehicle', 'automobile', 'button', 'card', 'navbar', 'nav', 'header', 'menu', 'form', 'input', 'login'];
    
    const hasNewKeyword = newComponentKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
    const hasComponentType = componentTypes.some(type => prompt.toLowerCase().includes(type));
    
    // Also check for color/style requests that indicate new components
    const styleKeywords = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'white', 'black'];
    const hasStyleRequest = styleKeywords.some(color => prompt.toLowerCase().includes(color));
    
    return (hasNewKeyword && hasComponentType) || (hasStyleRequest && prompt.toLowerCase().includes('button'));
  };
  
  // If this is a new component request, ignore context and create fresh
  if (isNewComponentRequest(promptLower)) {
    console.log('New component request detected:', promptLower);
    
    // Enhanced component matching with better prompt understanding
    if (promptLower.includes('car') || promptLower.includes('vehicle') || promptLower.includes('automobile')) {
      console.log('Generating car component');
      return components.car;
    } else if (promptLower.includes('button') || promptLower.includes('btn') || 
               (promptLower.includes('red') && promptLower.includes('button')) ||
               (promptLower.includes('blue') && promptLower.includes('button'))) {
      console.log('Generating button component');
      return components.button;
    } else if (promptLower.includes('card') || promptLower.includes('container') || 
               promptLower.includes('box') || promptLower.includes('image')) {
      console.log('Generating card component');
      return components.card;
    } else if (promptLower.includes('nav') || promptLower.includes('header') || 
               promptLower.includes('menu') || promptLower.includes('navigation') ||
               promptLower.includes('home') && promptLower.includes('about')) {
      console.log('Generating navbar component');
      return components.navbar;
    } else if (promptLower.includes('form') || promptLower.includes('input') || 
               promptLower.includes('login') || promptLower.includes('signup')) {
      console.log('Generating form component');
      return components.form;
    } else {
      // Smart default based on prompt content
      if (promptLower.includes('red') || promptLower.includes('blue') || promptLower.includes('green')) {
        console.log('Generating colored button component');
        return components.button;
      } else if (promptLower.includes('image') || promptLower.includes('photo')) {
        console.log('Generating card component with image');
        return components.card;
      } else {
        console.log('Generating default button component');
        return components.button;
      }
    }
  }
  
  // Handle iterative refinement for existing components
  if (context && context.jsx && context.css) {
    console.log('Iterative refinement detected');
    const promptLower = prompt.toLowerCase();
    
    // Apply modifications based on prompt
    if (promptLower.includes('larger') || promptLower.includes('bigger')) {
      return {
        jsx: context.jsx,
        css: context.css.replace(/font-size:\s*\d+px/g, 'font-size: 20px')
                       .replace(/padding:\s*\d+px/g, 'padding: 16px 32px')
                       .replace(/width:\s*\d+px/g, 'width: 250px')
                       .replace(/height:\s*\d+px/g, 'height: 100px')
      };
    }
    
    if (promptLower.includes('red')) {
      return {
        jsx: context.jsx,
        css: context.css.replace(/background-color:\s*#[0-9a-fA-F]{6}/g, 'background-color: #dc2626')
                       .replace(/color:\s*#[0-9a-fA-F]{6}/g, 'color: white')
                       .replace(/background:\s*linear-gradient\([^)]*\)/g, 'background: linear-gradient(45deg, #ff4444, #cc0000)')
      };
    }
    
    if (promptLower.includes('blue')) {
      return {
        jsx: context.jsx,
        css: context.css.replace(/background-color:\s*#[0-9a-fA-F]{6}/g, 'background-color: #3b82f6')
                       .replace(/color:\s*#[0-9a-fA-F]{6}/g, 'color: white')
                       .replace(/background:\s*linear-gradient\([^)]*\)/g, 'background: linear-gradient(45deg, #3b82f6, #1d4ed8)')
      };
    }
    
    if (promptLower.includes('rounded') || promptLower.includes('circle')) {
      return {
        jsx: context.jsx,
        css: context.css.replace(/border-radius:\s*\d+px/g, 'border-radius: 25px')
      };
    }
    
    // Default: return original with slight modification
    return {
      jsx: context.jsx,
      css: context.css + '\n/* Modified based on user request */'
    };
  }

  // Fallback: simple prompt matching for new components
  console.log('Fallback component matching');
  if (promptLower.includes('car') || promptLower.includes('vehicle') || promptLower.includes('automobile')) {
    return components.car;
  } else if (promptLower.includes('button') || promptLower.includes('btn')) {
    return components.button;
  } else if (promptLower.includes('card') || promptLower.includes('container') || promptLower.includes('box')) {
    return components.card;
  } else if (promptLower.includes('nav') || promptLower.includes('header') || promptLower.includes('menu') || promptLower.includes('navigation')) {
    return components.navbar;
  } else {
    // Default to button for generic requests
    return components.button;
  }
};

router.post("/generate", auth, upload.single('image'), async (req, res) => {
  try {
    const { prompt, sessionId } = req.body;
    const imageBuffer = req.file ? req.file.buffer : null;

    if ((!prompt && !imageBuffer) || !sessionId) {
      return res.status(400).json({ error: "Either prompt or image is required, and sessionId is required" });
    }

    // Get current session to check for existing component
    const session = await Session.findOne({ 
      _id: sessionId, 
      userId: req.user._id 
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if this is an iterative refinement or new component request
    const promptLower = (prompt || '').toLowerCase();
    const newComponentKeywords = ['create', 'make', 'build', 'generate', 'new'];
    const componentTypes = ['car', 'vehicle', 'automobile', 'button', 'card', 'navbar', 'nav', 'header', 'menu', 'form'];
    
    const hasNewKeyword = newComponentKeywords.some(keyword => promptLower.includes(keyword));
    const hasComponentType = componentTypes.some(type => promptLower.includes(type));
    const isNewComponentRequest = hasNewKeyword && hasComponentType;
    
    console.log('Request analysis:', {
      prompt: prompt,
      hasImage: !!imageBuffer,
      hasNewKeyword,
      hasComponentType,
      isNewComponentRequest,
      hasExistingComponent: !!(session.currentCode && session.currentCode.jsx)
    });

    // Determine context for AI
    let context = null;
    let isIterative = false;
    
    if (isNewComponentRequest || imageBuffer) {
      // New component request or image upload - ignore existing context
      console.log('Treating as new component request');
      context = null;
      isIterative = false;
    } else if (session.currentCode && session.currentCode.jsx && session.currentCode.css) {
      // Iterative refinement of existing component
      console.log('Treating as iterative refinement');
      context = session.currentCode;
      isIterative = true;
    } else {
      // No existing component, treat as new
      console.log('No existing component, treating as new request');
      context = null;
      isIterative = false;
    }

    // Generate component code (with context for iterative refinement)
    const generatedCode = await generateWithRealAI(prompt, context, imageBuffer);

    // Add user message to session
    session.messages.push({
      role: 'user',
      content: prompt || (imageBuffer ? 'Image upload' : 'Component request'),
      timestamp: new Date()
    });

    // Add AI response with better ChatGPT-like responses
    let responseMessage;
    if (imageBuffer) {
      responseMessage = `I've analyzed the image you uploaded and created a React component based on it. The component includes modern styling and follows best practices for React development. You can now see the live preview and modify the component properties as needed.`;
    } else if (isIterative) {
      responseMessage = `Perfect! I've updated the component based on your request: "${prompt}". The changes have been applied and you can see the updated preview. Feel free to make more adjustments or ask for additional modifications.`;
    } else {
      responseMessage = `Great! I've created a React component based on your request: "${prompt}". The component is now ready with both JSX and CSS styling. You can see the live preview and customize the properties using the controls below. Let me know if you'd like any adjustments!`;
    }

    session.messages.push({
      role: 'assistant',
      content: responseMessage,
      timestamp: new Date()
    });

    // Update the current code
    session.currentCode = {
      jsx: generatedCode.jsx,
      css: generatedCode.css
    };

    await session.save();

    console.log('Component generated successfully:', {
      isIterative,
      hasImage: !!imageBuffer,
      componentType: generatedCode.jsx.includes('Car') ? 'Car' : 
                    generatedCode.jsx.includes('Button') ? 'Button' : 
                    generatedCode.jsx.includes('Card') ? 'Card' : 
                    generatedCode.jsx.includes('Navbar') ? 'Navbar' : 
                    generatedCode.jsx.includes('Form') ? 'Form' : 'Unknown'
    });

    res.json({ 
      message: isIterative ? "Component updated successfully" : "Component generated successfully",
      session: session,
      isIterative: isIterative
    });

  } catch (error) {
    console.error("Error in /generate route:", error);
    res.status(500).json({ error: "Failed to generate component" });
  }
});

module.exports = router;
