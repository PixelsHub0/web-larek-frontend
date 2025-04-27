// src/base/views/AppState.ts

import { EventEmitter } from './base/EventEmitter';
import { AppEvent } from '../types';
import { IApiProductResponse, ICreateOrderRequest } from '../types';
import { FORM_ERRORS } from '../utils/constants';

/**
 * Интерфейс для хранения всего состояния приложения.
 */
interface AppStateData {
  catalog: IApiProductResponse[];              // Список всех товаров
  basket: string[];                            // ID товаров в корзине
  order: Partial<ICreateOrderRequest> & {      // Промежуточные данные заказа
    items?: string[];                          // Список ID для финального запроса
    total?: number;                            // Итоговая сумма
  };
}

export class AppState {
  private state: AppStateData = {
    catalog: [],
    basket: [],
    order: {},
  };

  constructor(private events: EventEmitter) {
    // Слушаем обновления из обеих форм (доставка и контакты)
    this.events.on(AppEvent.ORDER_UPDATED, this.updateOrder.bind(this));
  }

  /** Сбрасывает корзину */
  public clearBasket(): void {
    this.state.basket = [];
    this.events.emit(AppEvent.CART_CHANGED, this.state.basket);
  }

  /** Возвращает всю модель */
  public getState(): AppStateData {
    return this.state;
  }

  /** Устанавливает каталог из API */
  public setCatalog(data: IApiProductResponse[]): void {
    this.state.catalog = data;
    this.events.emit(AppEvent.CATALOG_CHANGED, data);
  }

  /** Добавляет товар в корзину */
  public addToBasket(id: string): void {
    if (!this.state.basket.includes(id)) {
      this.state.basket.push(id);
      this.events.emit(AppEvent.CART_CHANGED, this.state.basket);
    }
  }

  /** Удаляет товар из корзины */
  public removeFromBasket(id: string): void {
    this.state.basket = this.state.basket.filter(itemId => itemId !== id);
    this.events.emit(AppEvent.CART_CHANGED, this.state.basket);
  }

  /** Считает общую сумму корзины */
  private getTotal(): number {
    return this.state.basket.reduce((sum, id) => {
      const p = this.state.catalog.find(x => x.id === id);
      return sum + (p?.price ?? 0);
    }, 0);
  }

  /**
   * Обновляет любые поля заказа (доставка или контакты),
   * валидирует их и эмитит результат во View.
   */
  public updateOrder(data: Partial<ICreateOrderRequest>): void {
    // 1) Мерджим новые значения
    this.state.order = { ...this.state.order, ...data };

    // 2) Собираем ошибки
    const errors: Record<string, string> = {};

    //  – валидация шага «доставка»
    if ('address' in data || 'payment' in data) {
      if (!this.state.order.address?.trim()) {
        errors.address = FORM_ERRORS.addressRequired;
      }
      if (!this.state.order.payment) {
        errors.payment = FORM_ERRORS.paymentRequired;
      }
    }

    //  – валидация шага «контакты»
    if ('email' in data || 'phone' in data) {
      if (!this.state.order.email?.trim()) {
        errors.email = FORM_ERRORS.emailRequired;
      }
      if (!this.state.order.phone?.trim()) {
        errors.phone = FORM_ERRORS.phoneRequired;
      }
    }

    // 3) Эмитим результат валидации
    const isValid = Object.keys(errors).length === 0;
    this.events.emit(AppEvent.ORDER_FORM_VALIDITY_CHANGED, { isValid, errors });

    // 4) Если оба шага пройдены полностью — считаем итог и списки
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

  /** Сбрасывает данные заказа (после успешного оформления) */
  public resetOrder(): void {
    this.state.order = {};
    // (по желанию) можно эмитить здесь AppEvent.ORDER_SUCCESS или сброс формы
  }
}
