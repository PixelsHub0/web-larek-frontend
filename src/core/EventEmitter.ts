import {IEventEmitter} from "../types/core/EventEmitter"
abstract class EventEmitter implements IEventEmitter {
  abstract on(event: string, callback: Function): void;   
  abstract off(event: string, callback: Function): void;  
  abstract emit(event: string, ...args: any[]): void;     
}