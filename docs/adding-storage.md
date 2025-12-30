# Adding Data Storage

## JSON File Storage (Simple)

Create `src/utils/store.ts`:

```typescript
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

interface StoreData {
  users: Record<string, UserData>;
  settings: Record<string, string>;
}

interface UserData {
  points: number;
  level: number;
  lastActive: string;
}

const DATA_PATH = './data/store.json';

function ensureDataDir() {
  if (!existsSync('./data')) {
    mkdirSync('./data', { recursive: true });
  }
}

function load(): StoreData {
  ensureDataDir();
  if (!existsSync(DATA_PATH)) {
    return { users: {}, settings: {} };
  }
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

function save(data: StoreData) {
  ensureDataDir();
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// User functions
export function getUser(userId: string): UserData {
  const data = load();
  return data.users[userId] ?? { points: 0, level: 1, lastActive: '' };
}

export function updateUser(userId: string, updates: Partial<UserData>) {
  const data = load();
  data.users[userId] = { ...getUser(userId), ...updates };
  save(data);
}

export function addPoints(userId: string, points: number) {
  const user = getUser(userId);
  updateUser(userId, { points: user.points + points });
}

export function getAllUsers(): Record<string, UserData> {
  return load().users;
}

// Settings functions
export function getSetting(key: string): string | undefined {
  return load().settings[key];
}

export function setSetting(key: string, value: string) {
  const data = load();
  data.settings[key] = value;
  save(data);
}
```

## Add to .gitignore

```
data/
```

## Usage in Commands

```typescript
import { getUser, addPoints } from '../../utils/store.js';

async execute(interaction) {
  const user = getUser(interaction.user.id);
  addPoints(interaction.user.id, 10);

  await interaction.reply(`You now have ${user.points + 10} points!`);
}
```

## Leaderboard Example

```typescript
import { getAllUsers } from '../../utils/store.js';

async execute(interaction) {
  const users = getAllUsers();

  const sorted = Object.entries(users)
    .sort(([, a], [, b]) => b.points - a.points)
    .slice(0, 10);

  const list = sorted
    .map(([id, data], i) => `${i + 1}. <@${id}> - ${data.points} pts`)
    .join('\n');

  await interaction.reply(`**Leaderboard**\n${list}`);
}
```

## Alternative: SQLite

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

```typescript
import Database from 'better-sqlite3';

const db = new Database('./data/bot.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1
  )
`);

export function getUser(userId: string) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
}

export function addPoints(userId: string, points: number) {
  db.prepare(`
    INSERT INTO users (id, points) VALUES (?, ?)
    ON CONFLICT(id) DO UPDATE SET points = points + ?
  `).run(userId, points, points);
}
```
