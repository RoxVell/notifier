import { Source } from '../sources/abstract-source.js';
import { v4 as uuidv4 } from 'uuid';
import { injectable } from 'inversify';
import { IRequestRepository } from './request-repository.interface.js';

interface RequestItem {
  request: string;
  source: Source;
}

@injectable()
export class UrlRequestRepository implements IRequestRepository<RequestItem> {
  private readonly items = new Map<string, RequestItem>();

  getObservableItems(): RequestItem[] {
    return Array.from(this.items.values());
  }

  getItemById(id: string): RequestItem | null {
    return this.items.get(id) ?? null;
  }

  addItem(url: string, source: Source): string {
    // const id = uuidv4();
    this.items.set(url, { request: url, source });
    return url;
  }
}