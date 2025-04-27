// src/components/common/Basket.ts

import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';  // ← утиль для селекторов

/**
 * Компонент Basket отображает список товаров в корзине и общую стоимость,
 * а также управляет кнопкой "Оформить".
 */
export class Basket extends Component {
  private list: HTMLElement;
  private totalElement: HTMLElement;
  private checkoutButton: HTMLButtonElement;

  constructor(el: HTMLElement) {
    super(el);

    // Кэшируем все три элемента
    this.list           = ensureElement<HTMLElement>('.basket__list',  this.element);
    this.totalElement   = ensureElement<HTMLElement>('.basket__price', this.element);
    this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', this.element);
  }

  /**
   * Обновляет DOM-элементы списка.
   * Также включает или выключает кнопку "Оформить".
   */
  public setItems(items: HTMLElement[]): void {
    this.list.innerHTML = '';
    items.forEach(item => this.list.append(item));
    this.updateButton(items.length);
  }

  /** Обновляет итоговую сумму в корзине */
  public setTotal(total: number): void {
    this.setText(this.totalElement, `${total} синапсов`);
  }

  /** Подписаться на клик по кнопке "Оформить" */
  public onCheckout(callback: () => void): void {
    this.checkoutButton.addEventListener('click', callback);
  }

  /** Блокировка/разблокировка кнопки в зависимости от числа товаров */
  private updateButton(count: number): void {
    this.checkoutButton.disabled = count === 0;
  }
}
