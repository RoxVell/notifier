import { v4 as uuidv4 } from 'uuid';
import { injectable } from 'inversify';
import { ISubscribersRepository } from './subscribers-repository.interface.js';

@injectable()
export class SubscribersRepository implements ISubscribersRepository {
  private readonly subscribers = new Map<string, string[]>();

  addSubscriber(url: string): string {
    const newSubscriberId = uuidv4();
    const subscribers = this.subscribers.has(url) ? this.subscribers.get(url)! : [];
    this.subscribers.set(url, [...subscribers, newSubscriberId]);
    return newSubscriberId;
  }

  getSubscribersByUrl(url: string): string[] {
    return this.subscribers.has(url) ? this.subscribers.get(url)! : [];
  }
}
