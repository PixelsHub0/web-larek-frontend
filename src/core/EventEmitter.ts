import {IEventEmitter} from "../types/core/EventEmitter"
abstract class EventEmitter implements IEventEmitter {
  abstract on(event: string, callback: Function): void;   // Подписка
  abstract off(event: string, callback: Function): void;  // Отписка
  abstract emit(event: string, ...args: any[]): void;     // Генерация
}