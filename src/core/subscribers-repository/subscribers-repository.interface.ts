export interface ISubscribersRepository {
  addSubscriber(url: string): string;
  getSubscribersByUrl(url: string): string[];
}