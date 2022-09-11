import { injectable } from 'inversify';
import { IItemsRepository } from './items-repository.interface.js';

@injectable()
export class ItemsRepository implements IItemsRepository {
  private readonly items = new Map<string, unknown>();

  getItemByUrl(url: string): unknown | undefined {
    return this.items.get(url);
  }

  setItemByUrl(url: string, item: unknown) {
    this.items.set(url, item);
  }
}