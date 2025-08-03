// Test AI API Configuration
const axios = require('axios');

async function testAIConfig() {
  console.log('🔍 Testing AI API Configuration...\n');

  // Check environment variables
  const openaiKey = process.env.OPENAI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  console.log('Environment Variables:');
  console.log(`- OPENAI_API_KEY: ${openaiKey ? '✅ Set' : '❌ Not set'}`);
  console.log(`- OPENROUTER_API_KEY: ${openrouterKey ? '✅ Set' : '❌ Not set'}`);

  if (!openaiKey && !openrouterKey) {
    console.log('\n❌ No AI API keys configured!');
    console.log('Please set either OPENAI_API_KEY or OPENROUTER_API_KEY');
    console.log('See setup-ai-keys.md for instructions');
    return;
  }

  // Test OpenAI if available
  if (openaiKey) {
    console.log('\n🧪 Testing OpenAI API...');
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant. Respond with "API working!"'
            },
            {
              role: 'user',
              content: 'Test'
            }
          ],
          max_tokens: 10
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          }
        }
      );
      console.log('✅ OpenAI API working!');
    } catch (error) {
      console.log('❌ OpenAI API failed:', error.response?.data?.error?.message || error.message);
    }
  }

  // Test OpenRouter if available
  if (openrouterKey) {
    console.log('\n🧪 Testing OpenRouter API...');
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant. Respond with "API working!"'
            },
            {
              role: 'user',
              content: 'Test'
            }
          ],
          max_tokens: 10
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openrouterKey}`,
            'HTTP-Referer': 'https://your-app.com',
            'X-Title': 'Accio Component Generator'
          }
        }
      );
      console.log('✅ OpenRouter API working!');
    } catch (error) {
      console.log('❌ OpenRouter API failed:', error.response?.data?.error?.message || error.message);
    }
  }

  console.log('\n📝 Next Steps:');
  console.log('1. If APIs are working, your component generator should work');
  console.log('2. If APIs failed, check your API keys and billing');
  console.log('3. Test with: "create a simple button component"');
}

testAIConfig().catch(console.error); 