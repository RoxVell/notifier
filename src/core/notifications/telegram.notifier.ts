import TelegramBot from 'node-telegram-bot-api';
import { INotifier } from './notifier.js';

export interface TelegramNotifierConfig {
  readonly token: string;
  readonly chatId: string;
}

export class TelegramNotifier implements INotifier {
  // private readonly bot: TelegramBot;

  constructor(private readonly config: TelegramNotifierConfig) {
    // this.bot = new TelegramBot(this.config.token, { polling: true });
  }

  async notify(text: string): Promise<void> {
    const bot = new TelegramBot(this.config.token, { polling: false });
    await bot.sendMessage(this.config.chatId, text);
    bot.close()
  }
}