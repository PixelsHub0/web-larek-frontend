import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { AppEvent } from '../../types/events/enum';
import { EventEmitter } from '../base/EventEmitter';
import { CDN_URL } from '../../utils/constants';

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

    card.innerHTML = `
      <img src="${CDN_URL}${product.image}" class="card__image" />
      <h3 class="card__title">${product.title}</h3>
      <p class="card__price">${product.price ?? 'Бесценно'}</p>
      <button class="card__button">${product.price ? 'Купить' : 'Нет в наличии'}</button>
    `;

    const button = card.querySelector('.card__button')!;
    button.addEventListener('click', () => {
      this.events.emit(AppEvent.ORDER_ADD_PRODUCT, product.id);
    });

    return card;
  }
}
