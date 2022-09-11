import { Source } from '../sources/abstract-source';

export interface IRequestRepository<T = unknown> {
  getObservableItems(): T[];
  getItemById(id: string): T | null;
  addItem(request: string, source: Source): string;
}
