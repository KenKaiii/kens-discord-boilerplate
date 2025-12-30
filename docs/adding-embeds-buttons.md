# Adding Embeds & Buttons

## Rich Embed

```typescript
import { EmbedBuilder } from 'discord.js';

const embed = new EmbedBuilder()
  .setColor(0x5865f2)
  .setTitle('Title Here')
  .setDescription('Description text')
  .setThumbnail('https://example.com/image.png')
  .addFields(
    { name: 'Field 1', value: 'Value 1', inline: true },
    { name: 'Field 2', value: 'Value 2', inline: true },
  )
  .setFooter({ text: 'Footer text' })
  .setTimestamp();

await interaction.reply({ embeds: [embed] });
```

## Buttons

```typescript
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId('approve')
    .setLabel('Approve')
    .setStyle(ButtonStyle.Success),
  new ButtonBuilder()
    .setCustomId('deny')
    .setLabel('Deny')
    .setStyle(ButtonStyle.Danger),
);

await interaction.reply({ content: 'Choose:', components: [row] });
```

## Handle Button Click

In `src/events/interactionCreate.ts`:

```typescript
if (interaction.isButton()) {
  if (interaction.customId === 'approve') {
    await interaction.update({ content: 'Approved!', components: [] });
  } else if (interaction.customId === 'deny') {
    await interaction.update({ content: 'Denied!', components: [] });
  }
}
```

## Select Menu

```typescript
import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId('select-role')
    .setPlaceholder('Choose a role')
    .addOptions(
      { label: 'Developer', value: 'dev', description: 'For developers' },
      { label: 'Designer', value: 'design', description: 'For designers' },
    ),
);

await interaction.reply({ content: 'Select your role:', components: [row] });
```

## Handle Select Menu

```typescript
if (interaction.isStringSelectMenu()) {
  if (interaction.customId === 'select-role') {
    const selected = interaction.values[0];
    await interaction.update({ content: `You selected: ${selected}`, components: [] });
  }
}
```

## Modal (Text Input)

```typescript
import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

const modal = new ModalBuilder()
  .setCustomId('feedback-modal')
  .setTitle('Feedback');

const input = new TextInputBuilder()
  .setCustomId('feedback-input')
  .setLabel('Your feedback')
  .setStyle(TextInputStyle.Paragraph)
  .setRequired(true);

modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));

await interaction.showModal(modal);
```

## Handle Modal Submit

```typescript
if (interaction.isModalSubmit()) {
  if (interaction.customId === 'feedback-modal') {
    const feedback = interaction.fields.getTextInputValue('feedback-input');
    await interaction.reply({ content: `Thanks for: ${feedback}`, ephemeral: true });
  }
}
```

## Common Colors

```typescript
const colors = {
  primary: 0x5865f2,   // Discord blurple
  success: 0x57f287,   // Green
  warning: 0xfee75c,   // Yellow
  error: 0xed4245,     // Red
  info: 0x5865f2,      // Blue
};
```
