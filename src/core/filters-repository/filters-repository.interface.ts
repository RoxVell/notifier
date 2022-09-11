import { Filter } from '../interfaces';

export interface IFiltersRepository {
  addFilter(requestItemId: string, filters: Filter[]): string;
  getFiltersForRequestItem(requestItemId: string): { id: string; filters: Filter[] }[];
}
