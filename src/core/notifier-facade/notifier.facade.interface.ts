import { Source } from '../sources/abstract-source';
import { Filter } from '../interfaces';
import { INotifier } from '../notifications/notifier.js';

export interface INotifierFacade {
  subscribe(request: string, source: Source, filters: Filter[], notifiers: INotifier[]): void;
  getSourceByRequest(request: string): Promise<[string, Source] | null>;
  getSourceById(id: string): Source | null;
}