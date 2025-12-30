# Adding AI Functionality

## Setup Groq (Recommended)

1. Install SDK:
```bash
npm install groq-sdk
```

2. Add to `.env`:
```
GROQ_API_KEY=your_api_key_here
```

3. Create `src/utils/ai.ts`:

```typescript
import Groq from 'groq-sdk';

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export function isAIAvailable(): boolean {
  return groq !== null;
}

export async function chat(message: string): Promise<string> {
  if (!groq) throw new Error('AI not configured');

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: message }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content ?? 'No response';
}

export async function summarize(text: string): Promise<string> {
  if (!groq) throw new Error('AI not configured');

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'Summarize concisely in bullet points.' },
      { role: 'user', content: text }
    ],
    max_tokens: 512,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content ?? 'Could not summarize';
}
```

## AI Chat Command

Create `src/commands/ai/chat.ts`:

```typescript
import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../types/index.js';
import { chat, isAIAvailable } from '../../utils/ai.js';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Chat with AI')
    .addStringOption(option =>
      option.setName('message').setDescription('Your message').setRequired(true)
    ),

  async execute(interaction) {
    if (!isAIAvailable()) {
      await interaction.reply({ content: 'AI not configured.', ephemeral: true });
      return;
    }

    await interaction.deferReply();

    const message = interaction.options.getString('message', true);

    try {
      const response = await chat(message);
      await interaction.editReply(response.slice(0, 2000)); // Discord limit
    } catch (error) {
      await interaction.editReply('Failed to get AI response.');
    }
  },
};

export default command;
```

## Conversation History

```typescript
const conversations = new Map<string, { role: string; content: string }[]>();

export async function chatWithHistory(userId: string, message: string): Promise<string> {
  if (!groq) throw new Error('AI not configured');

  const history = conversations.get(userId) ?? [];
  history.push({ role: 'user', content: message });

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...history.slice(-10) // Keep last 10 messages
    ],
    max_tokens: 1024,
  });

  const reply = response.choices[0]?.message?.content ?? 'No response';
  history.push({ role: 'assistant', content: reply });
  conversations.set(userId, history);

  return reply;
}
```

## Alternative: OpenAI

```bash
npm install openai
```

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function chat(message: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: message }],
  });
  return response.choices[0]?.message?.content ?? 'No response';
}
```
