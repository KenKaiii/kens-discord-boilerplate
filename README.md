# kens-discord-bot

A modern Discord.js v14 bot boilerplate with TypeScript, ready for Railway deployment.

## Features

- Discord.js v14 with full TypeScript support
- ESM (ES Modules) throughout
- Slash command handler with automatic loading
- Event handler with automatic loading
- ESLint 9 with flat config + TypeScript support
- Prettier for code formatting
- Ready for Railway one-click deployment

## Prerequisites

- Node.js 20.0.0 or higher
- A Discord application with a bot token

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/KenKaiii/kens-discord-boilerplate.git
cd kens-discord-boilerplate
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Discord credentials:

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_dev_server_id  # Optional, for faster command updates
```

### 3. Get Discord Credentials

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application (or use an existing one)
3. Go to the "Bot" section and click "Reset Token" to get your bot token
4. Copy the "Application ID" from the "General Information" section (this is your `DISCORD_CLIENT_ID`)

### 4. Invite Your Bot

Use this URL template (replace `YOUR_CLIENT_ID`):

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

### 5. Deploy Commands

```bash
npm run deploy-commands
```

**Note:** If you set `DISCORD_GUILD_ID`, commands update instantly for that server. Without it, global commands may take up to 1 hour to appear.

### 6. Start the Bot

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

## Project Structure

```
src/
├── commands/          # Slash commands organized by category
│   └── utility/
│       ├── ping.ts    # Example ping command
│       └── info.ts    # Example info command with subcommands
├── events/            # Discord.js event handlers
│   ├── ready.ts       # Bot ready event
│   └── interactionCreate.ts  # Command interaction handler
├── handlers/          # Loaders for commands and events
│   ├── commandHandler.ts
│   └── eventHandler.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── config.ts          # Environment configuration
├── deploy-commands.ts # Command deployment script
└── index.ts           # Bot entry point
```

## Adding Commands

Create a new file in `src/commands/<category>/`:

```typescript
import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../types/index.js';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Says hello'),

  async execute(interaction) {
    await interaction.reply('Hello!');
  },
};

export default command;
```

Then run `npm run deploy-commands` to register it.

## Adding Events

Create a new file in `src/events/`:

```typescript
import { Events } from 'discord.js';
import type { Event } from '../types/index.js';

const event: Event = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    console.log(`${member.user.tag} joined the server`);
  },
};

export default event;
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start bot with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production bot |
| `npm run deploy-commands` | Register slash commands with Discord |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Check types without building |

## Deploy to Railway

### Option 1: One-Click Deploy

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new)

### Option 2: Manual Deploy

1. Push your code to GitHub
2. Go to [Railway](https://railway.com) and create a new project
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Add environment variables:
   - `DISCORD_TOKEN`
   - `DISCORD_CLIENT_ID`
6. Railway will automatically build and deploy

The `railway.toml` config handles build and start commands automatically.

## Code Quality

This boilerplate includes:

- **ESLint 9** with TypeScript support and flat config
- **Prettier** for consistent formatting
- **TypeScript** strict mode enabled

Run checks:

```bash
npm run lint        # Check for lint errors
npm run typecheck   # Check for type errors
npm run format:check # Check formatting
```

## License

MIT
