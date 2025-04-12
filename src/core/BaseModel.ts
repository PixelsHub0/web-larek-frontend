import { IEventEmitter } from "../types/core/EventEmitter";
abstract class BaseModel<T> {
  protected state: T;
  protected emitter: IEventEmitter;

  abstract getState(): T;
  protected abstract updateState(newState: Partial<T>): void;
}