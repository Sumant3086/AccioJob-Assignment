# 🤖 AI API Setup Guide

## The Issue
Your component generator is failing because the AI API keys are not configured. The error message "Failed to generate component. Please check your AI API configuration and try again" indicates that `OPENAI_API_KEY` or `OPENROUTER_API_KEY` is not set.

## Solution Options

### Option 1: Use OpenAI API (Recommended)
1. **Get OpenAI API Key:**
   - Go to https://platform.openai.com/api-keys
   - Sign up/Login to OpenAI
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Set Environment Variable on Render:**
   - Go to your Render dashboard
   - Select your backend service
   - Go to "Environment" tab
   - Add new environment variable:
     - **Key:** `OPENAI_API_KEY`
     - **Value:** Your OpenAI API key
   - Save and redeploy

### Option 2: Use OpenRouter API (Alternative)
1. **Get OpenRouter API Key:**
   - Go to https://openrouter.ai/keys
   - Sign up/Login to OpenRouter
   - Create a new API key
   - Copy the key

2. **Set Environment Variable on Render:**
   - Go to your Render dashboard
   - Select your backend service
   - Go to "Environment" tab
   - Add new environment variable:
     - **Key:** `OPENROUTER_API_KEY`
     - **Value:** Your OpenRouter API key
   - Save and redeploy

## Local Development Setup

If you want to test locally, create a `.env` file in the `backend` folder:

```bash
# backend/.env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-api-key
# or
OPENROUTER_API_KEY=your-openrouter-api-key
```

## Cost Information
- **OpenAI GPT-4o-mini:** ~$0.15 per 1M tokens (very cheap)
- **OpenRouter:** Similar pricing, multiple model options

## After Setup
1. Redeploy your backend service
2. Test with prompts like:
   - "create a dropdown menu"
   - "make a red button"
   - "create a navigation bar"

## Troubleshooting
- Make sure the API key is correct
- Check that the environment variable is set in Render
- Verify the backend service is redeployed after adding the key
- Check the backend logs for any API errors

## Quick Test
Once configured, try this prompt: "create a simple button component" 