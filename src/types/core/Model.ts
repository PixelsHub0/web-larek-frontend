export interface IModel<T> {
  getState(): T;
  updateState(newState: Partial<T>): void;
}