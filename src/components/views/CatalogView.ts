// src/components/views/CatalogView.ts

import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { AppEvent } from '../../types';
import { EventEmitter } from '../base/EventEmitter';
import { CDN_URL, categoryMapping } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

/**
 * Класс CatalogView отвечает за отображение списка карточек товаров
 * в каталоге на главной странице.
 */
export class CatalogView extends Component {
  /**
   * @param container Контейнер, в который будут отрисовываться карточки товаров
   * @param events    Брокер событий для общения с остальными частями приложения
   */
  constructor(
    protected container: HTMLElement,
    protected events: EventEmitter
  ) {
    super(container);
  }

  /**
   * Отрисовывает весь каталог.
   * @param products Массив товаров, полученных с сервера
   */
  public render(products: IApiProductResponse[]): void {
    this.container.innerHTML = '';
    products.forEach(product => {
      const card = this.createCard(product);
      this.container.append(card);
    });
  }

  /**
   * Создаёт и настраивает карточку одного товара.
   * @param product Данные одного товара
   * @returns готовый DOM-элемент карточки
   */
  protected createCard(product: IApiProductResponse): HTMLElement {
    // Берём шаблон карточки из DOM
    const template = ensureElement<HTMLTemplateElement>('#card-catalog');
    const card     = template.content.firstElementChild!
                         .cloneNode(true) as HTMLElement;

    card.dataset.id = product.id;

    // Кэшируем все элементы внутри карточки
    const categoryEl = ensureElement<HTMLElement>('.card__category', card);
    const titleEl    = ensureElement<HTMLElement>('.card__title',    card);
    const priceEl    = ensureElement<HTMLElement>('.card__price',    card);
    const imgEl      = ensureElement<HTMLImageElement>('.card__image', card);

    // Заполняем данные
    this.setText(categoryEl, product.category);
    this.toggleClass(
      categoryEl,
      categoryMapping[product.category] || 'card__category_other',
      true
    );

    this.setText(titleEl, product.title);
    this.setText(
      priceEl,
      product.price !== null
        ? `${product.price} синапсов`
        : 'Бесценно'
    );

    this.setImage(imgEl, `${CDN_URL}${product.image}`, product.title);

    // По клику открываем предпросмотр товара
    card.addEventListener('click', () => {
      this.events.emit(AppEvent.PRODUCT_PREVIEW_OPEN, product.id);
    });

    return card;
  }
}
