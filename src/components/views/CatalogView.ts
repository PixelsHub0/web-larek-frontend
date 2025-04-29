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
  constructor(
    protected containerElement: HTMLElement,
    protected events: EventEmitter
  ) {
    super(containerElement);
  }

  /**
   * Рендерит весь каталог: очищает контейнер и добавляет карточки товаров.
   * @param products Массив товаров, полученных с сервера
   */
  public render(products: IApiProductResponse[]): void {
    this.containerElement.innerHTML = '';
    products.forEach(product => {
      const productCard = this.createCard(product);
      this.containerElement.append(productCard);
    });
  }

  /**
   * Создаёт карточку одного товара из шаблона, заполняет её данными и
   * навешивает обработчик клика.
   * @param product Данные одного товара
   * @returns Готовый DOM-элемент карточки
   */
  protected createCard(product: IApiProductResponse): HTMLElement {
    const template = ensureElement<HTMLTemplateElement>('#card-catalog');
    const cardElement = template.content
      .firstElementChild!
      .cloneNode(true) as HTMLElement;

    // Сохраняем id товара
    cardElement.dataset.id = product.id;

    // Кэшируем элементы внутри карточки
    const categoryElement = ensureElement<HTMLElement>('.card__category', cardElement);
    const titleElement    = ensureElement<HTMLElement>('.card__title',    cardElement);
    const priceElement    = ensureElement<HTMLElement>('.card__price',    cardElement);
    const imageElement    = ensureElement<HTMLImageElement>('.card__image', cardElement);

    // Категория с цветовым классом
    this.setText(categoryElement, product.category);
    this.toggleClass(
      categoryElement,
      categoryMapping[product.category] || 'card__category_other',
      true
    );

    // Заголовок и цена
    this.setText(titleElement, product.title);
    this.setText(
      priceElement,
      product.price !== null
        ? `${product.price} синапсов`
        : 'Бесценно'
    );

    // Корректное склеивание URL изображения
    const imageUrl = product.image.startsWith('http')
      ? product.image
      : `${CDN_URL.replace(/\/+$/, '')}/${product.image.replace(/^\/+/, '')}`;
    this.setImage(imageElement, imageUrl, product.title);

    // Открытие предпросмотра по клику
    cardElement.addEventListener('click', () => {
      this.events.emit(AppEvent.PRODUCT_PREVIEW_OPEN, product.id);
    });

    return cardElement;
  }
}
