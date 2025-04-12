import { IEventEmitter } from "../types/core/EventEmitter";
export abstract class BaseModel<T> {
  protected state: T;
  protected emitter: IEventEmitter;

  abstract getState(): T;
  protected abstract updateState(newState: Partial<T>): void;
}