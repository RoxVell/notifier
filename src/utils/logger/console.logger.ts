import { Logger } from './logger.interface';

export class ConsoleLogger implements Logger {
  log(...args: unknown[]): void {
    console.log(...args);
  }

  info(...args: unknown[]): void {
    console.info(...args);
  }

  warn(...args: unknown[]): void {
    console.warn(...args);
  }

  error(...args: unknown[]): void {
    console.error(...args);
  }

  debug(...args: unknown[]): void {
    console.debug(...args);
  }
}