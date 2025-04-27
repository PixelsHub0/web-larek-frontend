// src/components/views/CatalogView.ts

import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { AppEvent } from '../../types';
import { EventEmitter } from '../base/EventEmitter';       // ← вернули импорт
import { categoryMapping } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CatalogView extends Component {
  /**
   * @param container корневой элемент под каталог
   * @param events    EventEmitter для всех событий
   */
  constructor(
    protected container: HTMLElement,
    protected events: EventEmitter               // ← поле events
  ) {
    super(container);
  }

  public render(products: IApiProductResponse[]): void {
    this.container.innerHTML = '';
    products.forEach(product => {
      const card = this.createCard(product);
      this.container.append(card);
    });
  }

  protected createCard(product: IApiProductResponse): HTMLElement {
    const template = ensureElement<HTMLTemplateElement>('#card-catalog');
    const card     = template.content.firstElementChild!
                         .cloneNode(true) as HTMLElement;

    card.dataset.id = product.id;

    const categoryEl = ensureElement<HTMLElement>('.card__category', card);
    const titleEl    = ensureElement<HTMLElement>('.card__title',    card);
    const priceEl    = ensureElement<HTMLElement>('.card__price',    card);
    const imgEl      = ensureElement<HTMLImageElement>('.card__image', card);

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

    this.setImage(imgEl, product.image, product.title);

    // Вот тут и правим — теперь this.events есть
    card.addEventListener('click', () => {
      this.events.emit(AppEvent.PRODUCT_PREVIEW_OPEN, product.id);
    });

    return card;
  }
}
