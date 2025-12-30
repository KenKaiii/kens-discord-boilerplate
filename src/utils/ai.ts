// AI Integration - Uncomment and configure as needed
//
// 1. Install: npm install groq-sdk
// 2. Add to .env: GROQ_API_KEY=your_key
// 3. Uncomment the code below

/*
import Groq from 'groq-sdk';

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export function isAIAvailable(): boolean {
  return groq !== null;
}

export async function chat(message: string): Promise<string> {
  if (!groq) throw new Error('AI not configured - set GROQ_API_KEY');

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: message },
    ],
    max_tokens: 1024,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content ?? 'No response';
}

export async function summarize(text: string): Promise<string> {
  if (!groq) throw new Error('AI not configured - set GROQ_API_KEY');

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'Summarize concisely in bullet points.' },
      { role: 'user', content: text },
    ],
    max_tokens: 512,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content ?? 'Could not summarize';
}
*/

// Placeholder exports - remove when uncommenting above
export function isAIAvailable(): boolean {
  return false;
}

export async function chat(_message: string): Promise<string> {
  throw new Error('AI not configured - see src/utils/ai.ts');
}

export async function summarize(_text: string): Promise<string> {
  throw new Error('AI not configured - see src/utils/ai.ts');
}
