// src/base/views/AppState.ts

import { EventEmitter } from './base/EventEmitter';
import { AppEvent } from '../types';
import { IApiProductResponse } from '../types';
import { ICreateOrderRequest } from '../types';

/**
 * Интерфейс для хранения всех данных приложения.
 */
interface AppStateData {
	catalog: IApiProductResponse[];  // Список всех товаров
	basket: string[];                // ID товаров, добавленных в корзину
	order: Partial<ICreateOrderRequest>; // Объект с данными оформления заказа
}

/**
 * AppState — главный класс для хранения состояния приложения.
 * Здесь находятся данные каталога, корзины и заказа,
 * а также логика для их изменения и взаимодействия с интерфейсом.
 */
export class AppState {
	private state: AppStateData = {
		catalog: [],   // Изначально каталог пуст
		basket: [],    // Корзина пуста
		order: {},     // Заказ ещё не оформлен
	};

	constructor(private events: EventEmitter) {}

	/**
	 * Полностью очищает корзину и сообщает об этом через событие.
	 */
	public clearBasket(): void {
		this.state.basket = [];
		this.events.emit(AppEvent.CART_CHANGED, this.state.basket);
	}

	/**
	 * Возвращает актуальное состояние всего приложения.
	 */
	public getState(): AppStateData {
		return this.state;
	}

	/**
	 * Устанавливает данные каталога и уведомляет об этом подписчиков.
	 */
	public setCatalog(data: IApiProductResponse[]): void {
		this.state.catalog = data;
		this.events.emit(AppEvent.CATALOG_CHANGED, data);
	}

	/**
	 * Добавляет товар в корзину, если он ещё не был добавлен.
	 */
	public addToBasket(id: string): void {
		if (!this.state.basket.includes(id)) {
			this.state.basket.push(id);
			this.events.emit(AppEvent.CART_CHANGED, this.state.basket);
		}
	}

	/**
	 * Удаляет товар из корзины по его ID.
	 */
	public removeFromBasket(id: string): void {
		this.state.basket = this.state.basket.filter(itemId => itemId !== id);
		this.events.emit(AppEvent.CART_CHANGED, this.state.basket);
	}

	/**
	 * Подсчитывает общую сумму товаров в корзине.
	 */
	private getTotal(): number {
		return this.state.basket.reduce((sum, id) => {
			const product = this.state.catalog.find(p => p.id === id);
			return sum + (product?.price ?? 0);
		}, 0);
	}

	/**
	 * Обновляет объект заказа новыми данными и,
	 * если все поля заполнены — добавляет итог и список товаров.
	 */
	public updateOrder(data: Record<string, unknown>): void {
		this.state.order = {
			...this.state.order,
			...data,
		};

		if (
			this.state.order.address &&
			this.state.order.payment &&
			this.state.order.email &&
			this.state.order.phone
		) {
			this.state.order.items = this.state.basket;
			this.state.order.total = this.getTotal();
		}
	}

	/**
	 * Сбрасывает данные заказа (используется после оформления).
	 */
	public resetOrder(): void {
		this.state.order = {};
	}
}
