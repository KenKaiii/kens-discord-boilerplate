# Environment Setup

## Required Variables

```env
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
```

## Optional Variables

```env
# Guild ID for faster command deployment (dev only)
DISCORD_GUILD_ID=your_server_id

# Channel IDs
WELCOME_CHANNEL_ID=
LOGS_CHANNEL_ID=

# AI Integration
GROQ_API_KEY=
OPENAI_API_KEY=

# Scheduled Tasks
DIGEST_CHANNEL_ID=
DIGEST_CRON=0 9 * * *
```

## Config Loader

Create `src/utils/config.ts`:

```typescript
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

function optional(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

export const config = {
  token: required('DISCORD_TOKEN'),
  clientId: required('DISCORD_CLIENT_ID'),
  guildId: optional('DISCORD_GUILD_ID'),

  channels: {
    welcome: optional('WELCOME_CHANNEL_ID'),
    logs: optional('LOGS_CHANNEL_ID'),
    digest: optional('DIGEST_CHANNEL_ID'),
  },

  ai: {
    groqKey: optional('GROQ_API_KEY'),
    openaiKey: optional('OPENAI_API_KEY'),
  },

  cron: {
    digest: optional('DIGEST_CRON', '0 9 * * *'),
  },
};
```

## Load Environment

Option 1: Use `dotenv` (install with `npm install dotenv`):

```typescript
// At top of src/index.ts
import 'dotenv/config';
```

Option 2: Node.js native (v20.6+):

```bash
node --env-file=.env dist/index.js
```

## Railway Environment

Set variables in Railway dashboard under Variables tab:
- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- Any other required variables

## Getting Discord Credentials

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create/select application
3. **Client ID**: General Information → Application ID
4. **Token**: Bot → Reset Token

## Bot Invite URL

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

Replace `YOUR_CLIENT_ID` with your actual client ID.
