<<<<<<< HEAD
import axios from 'axios';

export interface AIResponse {
  jsx: string;
  css: string;
  explanation?: string;
}

export class AIService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY!;
  }

  async generateComponent(prompt: string, previousComponent?: { jsx: string; css: string }): Promise<AIResponse> {
    try {
      const systemMessage = `You are a React component generator. Generate clean, functional React components based on user prompts.

Rules:
1. Always return valid JSX/TSX code
2. Include both JSX and CSS
3. Use modern React patterns (functional components, hooks)
4. Make components responsive and accessible
5. Return ONLY the component code, no explanations outside the code

Format your response as JSON:
{
  "jsx": "your jsx code here",
  "css": "your css code here",
  "explanation": "brief explanation"
}`;

      let userMessage = prompt;
      if (previousComponent) {
        userMessage += `\n\nCurrent component JSX:\n${previousComponent.jsx}\n\nCurrent CSS:\n${previousComponent.css}\n\nPlease modify this existing component based on the request.`;
      }

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(content);
        return {
          jsx: parsed.jsx || '',
          css: parsed.css || '',
          explanation: parsed.explanation || ''
        };
      } catch {
        // Fallback parsing if JSON is malformed
        return this.fallbackParse(content);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate component');
    }
  }

  private fallbackParse(content: string): AIResponse {
    // Simple fallback parsing
    const jsx = this.extractCodeBlock(content, 'jsx') || this.extractCodeBlock(content, 'javascript') || '';
    const css = this.extractCodeBlock(content, 'css') || '';
    
    return { jsx, css };
  }

  private extractCodeBlock(content: string, language: string): string {
    const regex = new RegExp(`\`\`\`${language}\\s*([\\s\\S]*?)\`\`\``, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }
=======
import axios from 'axios';

export interface AIResponse {
  jsx: string;
  css: string;
  explanation?: string;
}

export class AIService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY!;
  }

  async generateComponent(prompt: string, previousComponent?: { jsx: string; css: string }): Promise<AIResponse> {
    try {
      const systemMessage = `You are a React component generator. Generate clean, functional React components based on user prompts.

Rules:
1. Always return valid JSX/TSX code
2. Include both JSX and CSS
3. Use modern React patterns (functional components, hooks)
4. Make components responsive and accessible
5. Return ONLY the component code, no explanations outside the code

Format your response as JSON:
{
  "jsx": "your jsx code here",
  "css": "your css code here",
  "explanation": "brief explanation"
}`;

      let userMessage = prompt;
      if (previousComponent) {
        userMessage += `\n\nCurrent component JSX:\n${previousComponent.jsx}\n\nCurrent CSS:\n${previousComponent.css}\n\nPlease modify this existing component based on the request.`;
      }

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(content);
        return {
          jsx: parsed.jsx || '',
          css: parsed.css || '',
          explanation: parsed.explanation || ''
        };
      } catch {
        // Fallback parsing if JSON is malformed
        return this.fallbackParse(content);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate component');
    }
  }

  private fallbackParse(content: string): AIResponse {
    // Simple fallback parsing
    const jsx = this.extractCodeBlock(content, 'jsx') || this.extractCodeBlock(content, 'javascript') || '';
    const css = this.extractCodeBlock(content, 'css') || '';
    
    return { jsx, css };
  }

  private extractCodeBlock(content: string, language: string): string {
    const regex = new RegExp(`\`\`\`${language}\\s*([\\s\\S]*?)\`\`\``, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }
>>>>>>> 89eac74 (initial push,still working on)
}