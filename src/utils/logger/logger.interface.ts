export interface Logger {
  warn(...args: unknown[]): void;

  info(...args: unknown[]): void;

  log(...args: unknown[]): void;

  error(...args: unknown[]): void;

  debug(...args: unknown[]): void;
}