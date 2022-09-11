import { INotifier } from './notifier';

export interface INotifierRepository {
  addNotifiers(filtersItemId: string, notifiers: INotifier[]): void;
  getNotifiersForFilterItem(filterItemId: string): INotifier[];
}
