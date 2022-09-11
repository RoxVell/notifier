import { Filter } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';
import { injectable } from 'inversify';
import { IFiltersRepository } from './filters-repository.interface.js';

export interface FilterItem {
  requestItemId: string;
  filters: Filter[];
}

@injectable()
export class FiltersRepository implements IFiltersRepository {
  private readonly filters = new Map<string, FilterItem>();

  addFilter(requestItemId: string, filters: Filter[]): string {
    const id = uuidv4();
    this.filters.set(id, {requestItemId, filters});
    return id;
  }

  getFiltersForRequestItem(requestItemId: string): { id: string; filters: Filter[] }[] {
    return [...this.filters.entries()]
      .filter(([_, item]) => item.requestItemId === requestItemId)
      .map(([id, item]) => ({
        id,
        filters: item.filters
      }))
    // return this.filters.has(requestItemId)
    //  ? this.filters.get(requestItemId)!.filters
    //  : [];
  }
}

