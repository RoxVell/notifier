import deepDiff from 'deep-diff';
import { UrlRequestRepository } from '../request-repository/url-request-repository.js';
import { Logger } from '../../utils/logger/logger.interface.js';
import { ConsoleLogger } from '../../utils/logger/console.logger.js';
import { ItemsRepository } from '../items-repository/items-repository.js';
import { FiltersRepository } from '../filters-repository/filters-repository.js';
import { IUpdater } from './updater.interface';
import { TYPES } from '../../di/types.js';
import { inject, injectable } from 'inversify';
import { getEvent, isSatisfies } from '../events/events.js';
import { NotifiersRepository } from '../notifications/notifiers-repository.js';

@injectable()
export class Updater implements IUpdater {
  private updateIntervalId: number | undefined;

  constructor(
    @inject(TYPES.RequestRepository) private readonly requestRepository: UrlRequestRepository,
    @inject(TYPES.ItemsRepository) private readonly itemsRepository: ItemsRepository,
    @inject(TYPES.FiltersRepository) private readonly filtersRepository: FiltersRepository,
    @inject(TYPES.NotifiersRepository) private readonly notifiersRepository: NotifiersRepository,
    private readonly updateInterval: number = 10_000,
    private readonly logger: Logger = new ConsoleLogger()
  ) {}

  startUpdating() {
    this.updateIntervalId = setInterval(() => this.update(), this.updateInterval)[Symbol.toPrimitive]();
  }

  stopUpdating() {
    clearInterval(this.updateIntervalId);
  }

  private async update(): Promise<void> {
    console.log(`[Updater] Start updating process...`);

    const observableItems = this.requestRepository.getObservableItems();

    console.log(`[Updater] Найдено ${observableItems.length} наблюдаемых объектов`)

    for await (const { request, source } of observableItems) {
      const newItem = await source.getItem(request);
      const oldItem = this.itemsRepository.getItemByUrl(request);

      if (!oldItem) {
        console.debug('[Updater] Существующего айтема не найдено');
        this.itemsRepository.setItemByUrl(request, newItem);
        return;
      }

      const differences = deepDiff.diff(oldItem, newItem);

      if (differences) {
        console.log(`[Updater] Найдена разница между объектами`, {
          request: request,
          oldItem,
          newItem,
          difference: differences
        });

        const filters = this.filtersRepository.getFiltersForRequestItem(request);

        // console.log({filters});

        filters.forEach(({ id, filters }) => {
          console.log({filters});

          const messages: string[] = [];

          const isFiltersSatisfies = filters.every(({ field, event, payload }) => {
            // @ts-ignore
            const foundEvent = getEvent(source.getFieldType(field), event);

            if (!foundEvent) {
              console.error(`События не найден`, { field, event, payload });
              return false;
            }

            const fieldChange = differences.find(diff => diff.path![0] === field);

            if (!fieldChange) {
              return false;
            }

            if (fieldChange.kind === 'E') {
              // @ts-ignore
              const isSatisfiees = isSatisfies(source.getFieldType(field), fieldChange.lhs, fieldChange.rhs, filters);
              messages.push(
                foundEvent.message(field, fieldChange.lhs, fieldChange.rhs, payload)
              );
              return isSatisfiees;
            }
          });

          if (isFiltersSatisfies) {
            console.log(`Все фильтры соответствуют, можно отправлять уведомление!`);
            const notifiers = this.notifiersRepository.getNotifiersForFilterItem(id);
            const message = `[${source.title}] ${messages.join('\\n')}`;
            notifiers.forEach(notifier => notifier.notify(message));
          }
        });

        this.itemsRepository.setItemByUrl(request, newItem);
      }
    }
  }
}