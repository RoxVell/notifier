import { Source } from '../sources/abstract-source';

export interface ISourcesRepository {
  getSources(): Map<string, Source>;
  addSource(id: string, source: Source): void;
  getSourceById(id: string): Source | null;
}
