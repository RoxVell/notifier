import { Source } from '../sources/abstract-source.js';
import { inject, injectable } from 'inversify';
import { ISourcesRepository } from './sources-repository.interface.js';
import { TYPES } from '../../di/types.js';

export type SourcesList = [string, Source][];

@injectable()
export class SourcesRepository implements ISourcesRepository {
  private readonly sources = new Map<string, Source>();

  constructor(
    @inject(TYPES.SourcesList) sources: [string, Source][]
  ) {
    sources.forEach(([id, source]) => {
      this.addSource(id, source);
    });
  }

  getSources() {
    return this.sources;
  }

  addSource(id: string, source: Source) {
    this.sources.set(id, source);
  }

  getSourceById(id: string): Source | null {
    return this.sources.get(id) ?? null;
  }
}