// src/components/views/HeaderView.ts

import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

/**
 * HeaderView — компонент для управления элементами шапки сайта:
 * кнопкой открытия корзины и отображением счётчика товаров.
 */
export class HeaderView extends Component {
  /** Кнопка открытия корзины в шапке */
  private basketButton: HTMLElement;
  /** Элемент, отображающий число товаров в корзине */
  private counterElement: HTMLElement;

  /**
   * Инициализирует HeaderView.
   * @param root Элемент шапки сайта (например, <header>)
   */
  constructor(root: HTMLElement) {
    super(root);
    // Кэшируем элементы шапки один раз
    this.basketButton   = ensureElement<HTMLElement>('.header__basket',         this.element);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.element);
  }

  /**
   * Подписывается на клик по кнопке корзины.
   * @param handler Функция-обработчик, вызываемая при клике
   */
  public onBasketClick(handler: () => void): void {
    this.basketButton.addEventListener('click', handler);
  }

  /**
   * Обновляет отображаемое число товаров в корзине.
   * @param count Новое значение счётчика
   */
  public setCounter(count: number): void {
    this.counterElement.textContent = String(count);
  }
}
