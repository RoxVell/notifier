import { INotifier } from '../notifications/notifier.js';
import { SourcesRepository } from '../sources-repository/sources-repository.js';
import { Source } from '../sources/abstract-source.js';
import { ItemsRepository } from '../items-repository/items-repository.js';
import { UrlRequestRepository } from '../request-repository/url-request-repository.js';
import { NotifiersRepository } from '../notifications/notifiers-repository.js';
import { FiltersRepository } from '../filters-repository/filters-repository.js';
import { Filter } from '../interfaces';
import { INotifierFacade } from './notifier.facade.interface';
import { TYPES } from '../../di/types.js';
import { inject, injectable } from 'inversify';

@injectable()
export class NotifierFacade implements INotifierFacade {
  constructor(
    @inject(TYPES.SourcesRepository) private readonly sourcesRepository: SourcesRepository,
    @inject(TYPES.ItemsRepository) private readonly itemsRepository: ItemsRepository,
    @inject(TYPES.RequestRepository) private readonly requestRepository: UrlRequestRepository,
    @inject(TYPES.NotifiersRepository) private readonly notifiersRepository: NotifiersRepository,
    @inject(TYPES.FiltersRepository) private readonly filtersRepository: FiltersRepository,
  ) {}

  subscribe(request: string, source: Source, filters: Filter[], notifiers: INotifier[]) {
    console.log('[NotifierFacade] subscribe', { request, source, filters, notifiers });
    const requestItemId = this.requestRepository.addItem(request, source);
    const filtersId = this.filtersRepository.addFilter(requestItemId, filters);
    this.notifiersRepository.addNotifiers(filtersId, notifiers);
  }

  async getSourceByRequest(request: string): Promise<[string, Source] | null> {
    const sources = this.sourcesRepository.getSources();

    for await (const [id, source] of sources.entries()) {
      const isSourceMatches = await source.matches(request);
      if (isSourceMatches) return [id, source];
    }

    return null;
  }

  getSourceById(id: string) {
    return this.sourcesRepository.getSourceById(id);
  }
}