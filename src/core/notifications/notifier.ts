export interface INotifier {
  notify(text: string): Promise<void>;
}
