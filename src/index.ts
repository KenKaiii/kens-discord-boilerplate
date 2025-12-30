import { Client, Collection, Events } from 'discord.js';
import { config } from './utils/config.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadEvents } from './handlers/eventHandler.js';
import { loadFeatures } from './features/index.js';
import { logger } from './utils/logger.js';
import type { ExtendedClient, Feature } from './types/index.js';

let features: Feature[] = [];

async function main(): Promise<void> {
  logger.info('Starting bot...');

  const client = new Client({
    intents: config.intents,
    partials: config.partials,
  }) as ExtendedClient;

  client.commands = new Collection();

  try {
    await loadCommands(client);
    await loadEvents(client);

    // Load features
    features = loadFeatures();
    logger.info(`Loaded ${features.length} features`);

    // Initialize features after client is ready
    client.once(Events.ClientReady, async () => {
      for (const feature of features) {
        await feature.init(client);
        logger.info(`Initialized feature: ${feature.name}`);
      }
    });

    // Route messages to features
    client.on(Events.MessageCreate, async (message) => {
      if (message.author.bot) return;
      for (const feature of features) {
        if (feature.onMessage) {
          await feature.onMessage(message);
        }
      }
    });

    // Route reactions to features
    client.on(Events.MessageReactionAdd, async (reaction, user) => {
      if (user.bot) return;

      const fullReaction = reaction.partial ? await reaction.fetch() : reaction;
      const fullUser = user.partial ? await user.fetch() : user;

      for (const feature of features) {
        if (feature.onReaction) {
          await feature.onReaction(fullReaction, fullUser);
        }
      }
    });

    await client.login(config.token);
  } catch (error) {
    logger.error('Failed to start:', error);
    process.exit(1);
  }
}

main();
