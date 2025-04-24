// src/base/views/AppState.ts
import { EventEmitter } from './base/EventEmitter';
import { AppEvent } from '../types';
import { IApiProductResponse } from '../types';
import { ICreateOrderRequest } from '../types';

interface AppStateData {
	catalog: IApiProductResponse[];
	basket: string[];
	order: Partial<ICreateOrderRequest>;
}

export class AppState {
	private state: AppStateData = {
		catalog: [],
		basket: [],
		order: {},
	};

	constructor(private events: EventEmitter) {}

	public clearBasket(): void {
		this.state.basket = [];
		this.events.emit(AppEvent.CART_CHANGED, this.state.basket);
	}

	public getState(): AppStateData {
		return this.state;
	}

	public setCatalog(data: IApiProductResponse[]): void {
		this.state.catalog = data;
		this.events.emit(AppEvent.CATALOG_CHANGED, data);
	}

	public addToBasket(id: string): void {
		if (!this.state.basket.includes(id)) {
			this.state.basket.push(id);
			this.events.emit(AppEvent.CART_CHANGED, this.state.basket);
		}
	}

	public removeFromBasket(id: string): void {
		this.state.basket = this.state.basket.filter(itemId => itemId !== id);
		this.events.emit(AppEvent.CART_CHANGED, this.state.basket);
	}

	private getTotal(): number {
		return this.state.basket.reduce((sum, id) => {
			const product = this.state.catalog.find(p => p.id === id);
			return sum + (product?.price ?? 0);
		}, 0);
	}

	 public updateOrder(data: Record<string, unknown>): void {
     // 🔥 Обновляем поля формы
     this.state.order = {
         ...this.state.order,
         ...data,
     };

     // 🎯 Обновляем итог и товары каждый раз перед отправкой заказа
     if (
         this.state.order.address &&
         this.state.order.payment &&
         this.state.order.email &&
         this.state.order.phone
     ) {
         this.state.order.items = this.state.basket;
         this.state.order.total = this.getTotal();
     }

     console.log('✅ AppState.updateOrder — новое состояние order:', this.state.order);
 }

	public resetOrder(): void {
	console.log('🧼 AppState.resetOrder() вызван!');
	this.state.order = {};
}
}
