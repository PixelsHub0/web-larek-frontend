import { IEventEmitter } from "../types/core/EventEmitter";
abstract class BaseView {
  protected container: HTMLElement;
  protected emitter: IEventEmitter;

  abstract render(data?: any): void;
  protected abstract bindEvents(): void;
}