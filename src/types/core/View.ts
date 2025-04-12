export interface IView<T> {
  render(data: T): void;
  showError(message: string): void;
}