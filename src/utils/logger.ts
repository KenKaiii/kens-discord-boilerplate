const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  debug(message: string, ...args: unknown[]) {
    console.log(`${colors.cyan}[${timestamp()}] [DEBUG]${colors.reset}`, message, ...args);
  },

  info(message: string, ...args: unknown[]) {
    console.log(`${colors.green}[${timestamp()}] [INFO]${colors.reset}`, message, ...args);
  },

  warn(message: string, ...args: unknown[]) {
    console.warn(`${colors.yellow}[${timestamp()}] [WARN]${colors.reset}`, message, ...args);
  },

  error(message: string, ...args: unknown[]) {
    console.error(`${colors.red}[${timestamp()}] [ERROR]${colors.reset}`, message, ...args);
  },
};
