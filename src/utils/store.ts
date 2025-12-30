import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

// Define your data structure here
interface StoreData {
  users: Record<string, UserData>;
}

interface UserData {
  points: number;
  lastActive: string;
}

const DATA_DIR = './data';
const DATA_PATH = `${DATA_DIR}/store.json`;

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function load(): StoreData {
  ensureDataDir();
  if (!existsSync(DATA_PATH)) {
    return { users: {} };
  }
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8')) as StoreData;
}

function save(data: StoreData): void {
  ensureDataDir();
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// User functions
export function getUser(userId: string): UserData {
  const data = load();
  return data.users[userId] ?? { points: 0, lastActive: '' };
}

export function updateUser(userId: string, updates: Partial<UserData>): void {
  const data = load();
  data.users[userId] = { ...getUser(userId), ...updates };
  save(data);
}

export function getAllUsers(): Record<string, UserData> {
  return load().users;
}

// Add more store functions as needed
