// src/components/views/CatalogView.ts
import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { AppEvent } from '../../types/events/enum';
import { EventEmitter } from '../base/EventEmitter';
import { CDN_URL, categoryMapping } from '../../utils/constants';

export class CatalogView extends Component {
  constructor(
    protected container: HTMLElement,
    protected events: EventEmitter
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
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = product.id;

    const categoryClass = categoryMapping[product.category] || 'card__category_other';

    card.innerHTML = `
      <div class="card__column">
        <span class="card__category ${categoryClass}">${product.category}</span>
        <h3 class="card__title">${product.title}</h3>
        <img src="${CDN_URL}${product.image}" class="card__image" />
        <p class="card__price">${product.price ? `${product.price} синапсов` : 'Бесценно'}</p>
        <button class="card__button" ${product.price ? '' : 'disabled'}>
          ${product.price ? 'Купить' : 'Нет в наличии'}
        </button>
      </div>
    `;

    const button = card.querySelector('.card__button') as HTMLButtonElement;
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      if (product.price) {
        this.events.emit(AppEvent.ORDER_ADD_PRODUCT, product.id);
      }
    });

    card.addEventListener('click', () => {
      this.events.emit(AppEvent.PRODUCT_PREVIEW_OPEN, product.id);
    });

    return card;
  }
}
