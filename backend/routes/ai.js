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
          content: `You are an expert React component generator with a conversational, helpful personality like ChatGPT. You can handle different types of requests:

1. COMPONENT GENERATION: When users ask to create, make, build, or generate components
2. COMPONENT MODIFICATION: When users ask to modify existing components (make it red, larger, etc.)
3. IMAGE ANALYSIS: When users upload images and ask to generate components based on them
4. DESCRIPTIVE RESPONSES: When users ask to describe images or explain things (respond conversationally like ChatGPT)

IMPORTANT RULES:
1. For component requests, ALWAYS return a valid JSON object with 'jsx' and 'css' properties
2. For descriptive requests (like "describe this image"), respond conversationally without JSON
3. The JSX should be a complete, functional React component with proper imports
4. CSS should be comprehensive and modern with proper styling
5. Understand user intent - if they ask for a "dropdown menu", create a proper dropdown component
6. Be conversational and helpful in your responses
7. Generate REAL, WORKING code that can be executed

Component Types to Generate:
- Button: Interactive buttons with hover effects
- Card: Content cards with images, titles, descriptions
- Navbar: Navigation bars with links and mobile responsiveness
- Car: Visual car components with wheels, body, and details
- Form: Login/signup forms with proper validation
- Dropdown: Proper dropdown menus with options and state management
- Any other component the user requests

${context ? 'This is an iterative refinement. Modify the existing component based on the user request while preserving its core structure.' : 'Create a new component based on the user description.'}`
        }
      ];

      // Check if this is a descriptive request (not component generation)
      const descriptiveKeywords = ['describe', 'explain', 'what is', 'tell me about', 'how does', 'what does'];
      const isDescriptiveRequest = descriptiveKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

      if (isDescriptiveRequest) {
        // Handle descriptive requests conversationally
        messages.push({
          role: "user",
          content: prompt
        });

        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
          }
        );

        const content = response.data.choices[0].message.content;
        return { 
          jsx: null, 
          css: null, 
          descriptiveResponse: content 
        };
      }

      if (context) {
        messages.push({
          role: "user",
          content: `Current component:\nJSX: ${context.jsx}\nCSS: ${context.css}\n\nUser request: ${prompt}\n\nModify the component according to the user's request. Return only valid JSON with jsx and css properties.`
        });
      } else {
        messages.push({
          role: "user",
          content: `Create a React component for: "${prompt}". 

Generate a complete, working React component with proper JSX and CSS. The component should be:
- Functional and interactive
- Well-styled with modern CSS
- Responsive and accessible
- Include proper React imports and hooks if needed

Examples of what to generate:
- "dropdown menu" → Dropdown component with options and state
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

    // If no AI is configured, use local fallback
    console.log("No AI API configured, using local fallback generator");
    return generateLocalFallback(prompt, context, imageBuffer);
  } catch (error) {
    console.error("Error in generateWithRealAI:", error);
    // Use local fallback if AI fails
    console.log("AI generation failed, using local fallback");
    return generateLocalFallback(prompt, context, imageBuffer);
  }
};

// Local fallback component generator
const generateLocalFallback = (prompt, context = null, imageBuffer = null) => {
  const promptLower = prompt.toLowerCase();
  
  // Navbar component
  if (promptLower.includes('navbar') || promptLower.includes('nav') || promptLower.includes('menu')) {
    return {
      jsx: `import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-800">E-Commerce</h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Shop
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Price
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Events
            </a>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                Home
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                Shop
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                Price
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                Events
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;`,
      css: `/* Navbar Styles */
nav {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-brand {
  font-weight: bold;
  color: #1f2937;
}

.nav-link {
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #1f2937;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 50%;
  background-color: #3b82f6;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

/* Mobile menu animation */
.mobile-menu {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .navbar-nav {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .nav-link {
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .nav-link:last-child {
    border-bottom: none;
  }
}`
    };
  }
  
  // Button component
  if (promptLower.includes('button')) {
    return {
      jsx: `import React from 'react';

const Button = ({ children, variant = 'primary', size = 'medium', onClick }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={\`\${baseClasses} \${variants[variant]} \${sizes[size]}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;`,
      css: `/* Button Styles */
button {
  cursor: pointer;
  user-select: none;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Button animations */
button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
}

/* Focus styles for accessibility */
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}`
    };
  }
  
  // Card component
  if (promptLower.includes('card')) {
    return {
      jsx: `import React from 'react';

const Card = ({ title, description, image, price, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {image && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {price && (
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">${price}</span>
            <button
              onClick={onAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;`,
      css: `/* Card Styles */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.card-image {
  position: relative;
  overflow: hidden;
}

.card-image img {
  transition: transform 0.3s ease;
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.card-description {
  color: #6b7280;
  line-height: 1.6;
}

.card-price {
  font-weight: bold;
  color: #059669;
}

.card-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.card-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}`
    };
  }
  
  // Form component
  if (promptLower.includes('form') || promptLower.includes('login')) {
    return {
      jsx: `import React, { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Handle form submission here
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={\`appearance-none rounded-none relative block w-full px-3 py-2 border \${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm\`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={\`appearance-none rounded-none relative block w-full px-3 py-2 border \${errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm\`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;`,
      css: `/* Form Styles */
.form-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.form-title {
  text-align: center;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-button {
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.form-button:active {
  transform: translateY(0);
}`
    };
  }
  
  // Default fallback for any other request
  return {
    jsx: `import React from 'react';

const Component = () => {
  return (
    <div className="p-8 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Component</h2>
      <p className="text-gray-600">
        This is a fallback component generated for: "${prompt}"
      </p>
      <div className="mt-4 p-4 bg-white rounded border">
        <p className="text-sm text-gray-500">
          Note: This component was generated using the local fallback system. 
          For more advanced components, please configure your AI API keys.
        </p>
      </div>
    </div>
  );
};

export default Component;`,
    css: `/* Fallback Component Styles */
.fallback-component {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 0.5rem;
  padding: 2rem;
  margin: 1rem 0;
}

.fallback-title {
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 1rem;
}

.fallback-text {
  color: #6b7280;
  line-height: 1.6;
}

.fallback-note {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 1rem;
  margin-top: 1rem;
}

.fallback-note-text {
  color: #9ca3af;
  font-size: 0.875rem;
}`
  };
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
    const componentTypes = ['car', 'vehicle', 'automobile', 'button', 'card', 'navbar', 'nav', 'header', 'menu', 'form', 'dropdown'];
    
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

    // Generate component code with timeout and fallback
    let generatedCode;
    let isDescriptiveResponse = false;
    try {
      // Set a timeout for AI generation
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI generation timeout')), 30000) // 30 seconds
      );
      
      const generationPromise = generateWithRealAI(prompt, context, imageBuffer);
      generatedCode = await Promise.race([generationPromise, timeoutPromise]);
      
      // Check if this is a descriptive response
      if (generatedCode.descriptiveResponse) {
        isDescriptiveResponse = true;
      }
      
    } catch (error) {
      console.error('AI generation failed:', error.message);
      return res.status(500).json({ 
        error: "Failed to generate component. Please check your AI API configuration and try again." 
      });
    }

    // Add user message to session
    session.messages.push({
      role: 'user',
      content: prompt || (imageBuffer ? 'Image upload' : 'Component request'),
      timestamp: new Date()
    });

    // Add AI response with better ChatGPT-like responses
    let responseMessage;
    if (isDescriptiveResponse) {
      // Use the descriptive response from AI
      responseMessage = generatedCode.descriptiveResponse;
    } else if (imageBuffer) {
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

    // Update the current code (only for component responses)
    if (!isDescriptiveResponse) {
    session.currentCode = {
      jsx: generatedCode.jsx,
      css: generatedCode.css
    };
    }

    // Save session with error handling
    try {
    await session.save();
      console.log('Session saved successfully');
    } catch (saveError) {
      console.error('Failed to save session:', saveError);
      return res.status(500).json({ error: "Failed to save session" });
    }

    console.log('Component generated successfully:', {
      isIterative,
      hasImage: !!imageBuffer,
      isDescriptive: isDescriptiveResponse,
      componentType: generatedCode.jsx ? 'Component' : 'Descriptive'
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
