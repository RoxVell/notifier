import { INotifier } from './notifier.js';
import { injectable } from 'inversify';
import { INotifierRepository } from './notifier-repository.interface';

@injectable()
export class NotifiersRepository implements INotifierRepository {
  private readonly notifications = new Map<string, INotifier[]>;

  addNotifiers(filtersItemId: string, notifiers: INotifier[]) {
    if (this.notifications.has(filtersItemId)) {
      const existedNotifiers = this.notifications.get(filtersItemId)!;
      this.notifications.set(filtersItemId, [...existedNotifiers, ...notifiers]);
    } else {
      this.notifications.set(filtersItemId, notifiers)
    }
  }

  getNotifiersForFilterItem(filterItemId: string): INotifier[] {
    return [...(this.notifications.get(filterItemId) || []).values()];
  }
}
