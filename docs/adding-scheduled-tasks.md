# Adding Scheduled Tasks

## Setup

```bash
npm install node-cron
npm install -D @types/node-cron
```

## Basic Cron Job

Create `src/features/scheduler.ts`:

```typescript
import cron from 'node-cron';
import type { Client, TextChannel } from 'discord.js';

export function initScheduler(client: Client) {
  // Every day at 9am
  cron.schedule('0 9 * * *', async () => {
    const channel = client.channels.cache.get('CHANNEL_ID') as TextChannel;
    if (channel) {
      await channel.send('Good morning!');
    }
  });
}
```

## Cron Syntax

```
┌────────────── minute (0-59)
│ ┌──────────── hour (0-23)
│ │ ┌────────── day of month (1-31)
│ │ │ ┌──────── month (1-12)
│ │ │ │ ┌────── day of week (0-6, Sun=0)
│ │ │ │ │
* * * * *
```

| Schedule | Expression |
|----------|-----------|
| Every hour | `0 * * * *` |
| Every day 9am | `0 9 * * *` |
| Every Monday 10am | `0 10 * * 1` |
| Every 30 min | `*/30 * * * *` |

## Reddit Digest Example

```typescript
import cron from 'node-cron';
import { EmbedBuilder, type Client, type TextChannel } from 'discord.js';

interface RedditPost {
  title: string;
  url: string;
  score: number;
  subreddit: string;
}

async function fetchRedditPosts(subreddit: string): Promise<RedditPost[]> {
  const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=5`);
  const data = await res.json();

  return data.data.children.map((post: any) => ({
    title: post.data.title,
    url: `https://reddit.com${post.data.permalink}`,
    score: post.data.score,
    subreddit: post.data.subreddit,
  }));
}

export function initRedditDigest(client: Client, channelId: string) {
  cron.schedule('0 9 * * *', async () => {
    const channel = client.channels.cache.get(channelId) as TextChannel;
    if (!channel) return;

    const posts = await fetchRedditPosts('programming');

    const embed = new EmbedBuilder()
      .setColor(0xff4500)
      .setTitle('Daily Reddit Digest')
      .setDescription(
        posts.map(p => `• [${p.title}](${p.url}) (${p.score} pts)`).join('\n')
      );

    await channel.send({ embeds: [embed] });
  });
}
```

## Initialize in Main

In `src/index.ts`:

```typescript
import { initScheduler } from './features/scheduler.js';
import { initRedditDigest } from './features/redditDigest.js';

client.once(Events.ClientReady, () => {
  initScheduler(client);
  initRedditDigest(client, process.env.DIGEST_CHANNEL_ID!);
});
```

## Environment Config

Add to `.env`:

```
DIGEST_CHANNEL_ID=123456789
DIGEST_CRON=0 9 * * *
```

Load dynamically:

```typescript
const cronSchedule = process.env.DIGEST_CRON ?? '0 9 * * *';
cron.schedule(cronSchedule, async () => { /* ... */ });
```
