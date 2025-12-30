import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from './utils/config.js';
import type { Command } from './types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function deployCommands(): Promise<void> {
  const commands: unknown[] = [];

  const commandsPath = join(__dirname, 'commands');
  const commandFolders = readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = join(commandsPath, folder);
    const commandFiles = readdirSync(folderPath).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    );

    for (const file of commandFiles) {
      const filePath = join(folderPath, file);
      const fileUrl = pathToFileURL(filePath).href;
      const commandModule = (await import(fileUrl)) as { default: Command };
      const command = commandModule.default;

      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`[Deploy] Loaded command: ${command.data.name}`);
      }
    }
  }

  const rest = new REST().setToken(config.token);

  try {
    console.log(`[Deploy] Started refreshing ${commands.length} application (/) commands.`);

    if (config.guildId) {
      // Deploy to specific guild (instant update - good for development)
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
        body: commands,
      });
      console.log(`[Deploy] Successfully reloaded commands for guild: ${config.guildId}`);
    } else {
      // Deploy globally (may take up to 1 hour to propagate)
      await rest.put(Routes.applicationCommands(config.clientId), {
        body: commands,
      });
      console.log(
        '[Deploy] Successfully reloaded global commands (may take up to 1 hour to propagate)'
      );
    }
  } catch (error) {
    console.error('[Deploy] Error:', error);
    process.exit(1);
  }
}

deployCommands();
