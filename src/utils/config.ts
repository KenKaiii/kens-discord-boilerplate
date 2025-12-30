import 'dotenv/config';
import { GatewayIntentBits, Partials } from 'discord.js';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

export const config = {
  // Required
  token: required('DISCORD_TOKEN'),
  clientId: required('DISCORD_CLIENT_ID'),

  // Optional - Guild ID for development (faster command updates)
  guildId: optional('DISCORD_GUILD_ID'),

  // Optional - Channel IDs
  channels: {
    welcome: optional('WELCOME_CHANNEL_ID'),
    logs: optional('LOGS_CHANNEL_ID'),
  },

  // Bot configuration
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
} as const;
