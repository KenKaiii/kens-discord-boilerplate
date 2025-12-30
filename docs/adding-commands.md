# Adding Slash Commands

## Basic Command

Create `src/commands/<category>/<name>.ts`:

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

## Command with Options

```typescript
const command: Command = {
  data: new SlashCommandBuilder()
    .setName('greet')
    .setDescription('Greet someone')
    .addUserOption(option =>
      option.setName('user').setDescription('User to greet').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message').setDescription('Custom message').setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const message = interaction.options.getString('message') ?? 'Hello!';
    await interaction.reply(`${message} ${user}`);
  },
};
```

## Command with Subcommands

```typescript
const command: Command = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Manage settings')
    .addSubcommand(sub =>
      sub.setName('view').setDescription('View settings')
    )
    .addSubcommand(sub =>
      sub.setName('reset').setDescription('Reset settings')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'view':
        await interaction.reply('Current settings...');
        break;
      case 'reset':
        await interaction.reply('Settings reset!');
        break;
    }
  },
};
```

## Deferred Reply (Long Operations)

```typescript
async execute(interaction) {
  await interaction.deferReply(); // Shows "Bot is thinking..."

  // Do long operation...
  const result = await someLongTask();

  await interaction.editReply(`Done: ${result}`);
}
```

## Ephemeral Reply (Only User Sees)

```typescript
await interaction.reply({ content: 'Only you can see this!', ephemeral: true });
```

## After Adding

Run `npm run deploy-commands` to register with Discord.
