// AppState.ts
import { EventEmitter } from './base/EventEmitter';
import { AppEvent } from '../types/events/enum';

interface AppStateData {
	catalog: unknown[];
	basket: string[];
	order: Record<string, unknown>;
}

export class AppState {
	private state: AppStateData = {
		catalog: [],
		basket: [],
		order: {},
	};

	constructor(private events: EventEmitter) {}

	public getState(): AppStateData {
		return this.state;
	}

	public setCatalog(data: unknown[]): void {
		this.state.catalog = data;
		this.events.emit(AppEvent.CATALOG_CHANGED, data);
	}

	public addToBasket(id: string): void {
		this.state.basket.push(id);
		this.events.emit(AppEvent.CART_CHANGED, this.state.basket);
	}

	public updateOrder(data: Record<string, unknown>): void {
		this.state.order = { ...this.state.order, ...data };
		this.events.emit(AppEvent.ORDER_UPDATED, this.state.order);
	}
}
