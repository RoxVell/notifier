export interface IItemsRepository {
  getItemByUrl(url: string): unknown | undefined;
  setItemByUrl(url: string, item: unknown): void;
}