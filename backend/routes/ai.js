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

    // If no AI is configured, throw error
    throw new Error("No AI API configured. Please set OPENAI_API_KEY or OPENROUTER_API_KEY");
  } catch (error) {
    console.error("Error in generateWithRealAI:", error);
    throw error;
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
