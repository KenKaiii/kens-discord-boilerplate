# Adding Features (Plugin Pattern)

## Feature Interface

Add to `src/types/index.ts`:

```typescript
import type { Client, Message, MessageReaction, User } from 'discord.js';

export interface Feature {
  name: string;
  init: (client: Client) => Promise<void>;
  onMessage?: (message: Message) => Promise<void>;
  onReaction?: (reaction: MessageReaction, user: User) => Promise<void>;
}
```

## Create Feature Loader

Create `src/features/index.ts`:

```typescript
import type { Feature } from '../types/index.js';
import linkSaver from './linkSaver.js';
import autoResponder from './autoResponder.js';

export function loadFeatures(): Feature[] {
  return [linkSaver, autoResponder];
}
```

## Example: Link Saver

Create `src/features/linkSaver.ts`:

```typescript
import type { Feature } from '../types/index.js';

const feature: Feature = {
  name: 'linkSaver',

  async init(client) {
    console.log('[Feature] Link Saver initialized');
  },

  async onReaction(reaction, user) {
    if (reaction.emoji.name !== '🔖') return;

    const message = reaction.message;
    const urls = message.content?.match(/https?:\/\/[^\s]+/g);

    if (urls) {
      // Save to storage
      console.log(`Saved links: ${urls.join(', ')}`);
    }
  },
};

export default feature;
```

## Example: Auto Responder

Create `src/features/autoResponder.ts`:

```typescript
import type { Feature } from '../types/index.js';

const feature: Feature = {
  name: 'autoResponder',

  async init(client) {
    console.log('[Feature] Auto Responder initialized');
  },

  async onMessage(message) {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === 'ping') {
      await message.reply('Pong!');
    }
  },
};

export default feature;
```

## Initialize in Main

Update `src/index.ts`:

```typescript
import { loadFeatures } from './features/index.js';

const features = loadFeatures();

// Initialize all features
client.once(Events.ClientReady, async () => {
  for (const feature of features) {
    await feature.init(client);
  }
});

// Route messages to features
client.on(Events.MessageCreate, async (message) => {
  for (const feature of features) {
    if (feature.onMessage) {
      await feature.onMessage(message);
    }
  }
});

// Route reactions to features
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();

  for (const feature of features) {
    if (feature.onReaction) {
      await feature.onReaction(reaction, user);
    }
  }
});
```

## Feature with Cron

```typescript
import cron from 'node-cron';
import type { Feature } from '../types/index.js';
import type { TextChannel } from 'discord.js';

const feature: Feature = {
  name: 'dailyReminder',

  async init(client) {
    cron.schedule('0 9 * * *', async () => {
      const channel = client.channels.cache.get('CHANNEL_ID') as TextChannel;
      await channel?.send('Daily reminder!');
    });
  },
};

export default feature;
```
