# kens-discord-bot

A Discord.js v14 bot boilerplate in TypeScript with automatic command/event handlers, ready for Railway deployment.

## Project Structure

```
src/
├── commands/           # Slash commands organized by category
│   └── utility/        # Utility commands (ping, info)
├── events/             # Discord.js event handlers
├── features/           # Plugin-style features (auto-loaded)
├── handlers/           # Dynamic loaders for commands and events
├── types/              # TypeScript interfaces
├── utils/              # Utility modules
│   ├── config.ts       # Environment configuration
│   ├── logger.ts       # Colored console logging
│   ├── store.ts        # JSON file storage
│   └── ai.ts           # AI integration (Groq/OpenAI)
├── deploy-commands.ts  # Script to register slash commands
└── index.ts            # Bot entry point
```

## Organization Rules

**Keep code organized and modularized:**
- Commands → `src/commands/<category>/`, one command per file
- Events → `src/events/`, one event per file
- Features → `src/features/`, one feature per file
- Utilities → `src/utils/`, grouped by functionality
- Types → `src/types/`

**See `docs/` folder for detailed guides on adding:**
- Commands, Events, Features, AI, Storage, Scheduled Tasks, Embeds/Buttons

## Code Quality - Zero Tolerance

After editing ANY file, run:

```bash
npm run check
```

This runs typecheck + lint (includes Prettier formatting checks).

Fix ALL errors/warnings before continuing.

## Quick Reference

```bash
npm run dev              # Development with hot reload
npm run deploy-commands  # Register slash commands
npm run check            # Type check + lint
npm run lint:fix         # Auto-fix lint issues
```
