// src/components/views/BasketItemView.ts

import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { AppEvent } from '../../types';
import { EventEmitter } from '../base/EventEmitter';
import { ensureElement } from '../../utils/utils';

/**
 * BasketItemView — компонент для отображения одной строки товара в корзине.
 * Отвечает за:
 * - наполнение данных по товару (порядковый номер, название, цена);
 * - обработку клика по кнопке удаления из корзины.
 */
export class BasketItemView extends Component {
  /**
   * Создаёт экземпляр BasketItemView, клонирует шаблон элемента и
   * инициализирует логику удаления.
   *
   * @param element       Элемент <li> из шаблона корзины
   * @param events        Событийный эмиттер для взаимодействия с AppState
   * @param product       Данные товара, отображаемые в строке корзины
   * @param position      Индекс позиции в корзине (0-based)
   */
  constructor(
    element: HTMLElement,
    private events: EventEmitter,
    private product: IApiProductResponse,
    private position: number
  ) {
    super(element);

    // Находим и кэшируем подэлементы
    const indexElement   = ensureElement<HTMLElement>('.basket__item-index',     this.element);
    const titleElement   = ensureElement<HTMLElement>('.card__title',            this.element);
    const priceElement   = ensureElement<HTMLElement>('.card__price',            this.element);
    const deleteButton   = ensureElement<HTMLButtonElement>('.basket__item-delete', this.element);

    // Заполняем номер позиции, имя и цену товара
    indexElement.textContent = String(this.position + 1);
    titleElement.textContent = this.product.title;
    priceElement.textContent = `${this.product.price ?? 'Бесценно'} синапсов`;

    // Подписываемся на клик по кнопке «удалить»
    deleteButton.addEventListener('click', () => {
      // Эмитируем событие удаления товара из корзины
      this.events.emit(AppEvent.ORDER_REMOVE_PRODUCT, this.product.id);
    });
  }
}
