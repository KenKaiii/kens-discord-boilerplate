# Adding Events

## Basic Event

Create `src/events/<name>.ts`:

```typescript
import { Events } from 'discord.js';
import type { Event } from '../types/index.js';

const event: Event = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    console.log(`Message: ${message.content}`);
  },
};

export default event;
```

## One-Time Event

```typescript
const event: Event = {
  name: Events.ClientReady,
  once: true, // Only fires once
  execute(client) {
    console.log(`Logged in as ${client.user?.tag}`);
  },
};
```

## Common Events

| Event | Triggers When |
|-------|--------------|
| `Events.ClientReady` | Bot starts up |
| `Events.InteractionCreate` | Slash command/button/menu used |
| `Events.MessageCreate` | New message sent |
| `Events.MessageReactionAdd` | Reaction added |
| `Events.GuildMemberAdd` | User joins server |
| `Events.GuildMemberRemove` | User leaves server |

## Member Join Example

```typescript
import { Events, EmbedBuilder } from 'discord.js';
import type { Event } from '../types/index.js';

const event: Event = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const channel = member.guild.systemChannel;
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`Welcome ${member.user.username}!`)
      .setDescription('Thanks for joining!')
      .setThumbnail(member.user.displayAvatarURL());

    await channel.send({ embeds: [embed] });
  },
};

export default event;
```

## Reaction Event Example

```typescript
import { Events } from 'discord.js';
import type { Event } from '../types/index.js';

const event: Event = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (user.bot) return;

    // Handle partial reactions
    if (reaction.partial) {
      await reaction.fetch();
    }

    if (reaction.emoji.name === '⭐') {
      console.log(`${user.tag} starred a message`);
    }
  },
};

export default event;
```

## Required Intents

Add to `src/config.ts` if needed:

```typescript
intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMembers,        // For member events
  GatewayIntentBits.GuildMessageReactions, // For reaction events
  GatewayIntentBits.MessageContent,      // To read message content
],
```
