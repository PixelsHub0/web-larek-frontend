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
	const template = document.getElementById('card-catalog') as HTMLTemplateElement;
	const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

	card.dataset.id = product.id;

	(card.querySelector('.card__category') as HTMLElement).textContent = product.category;
	(card.querySelector('.card__category') as HTMLElement).classList.add(categoryMapping[product.category] || 'card__category_other');

	(card.querySelector('.card__title') as HTMLElement).textContent = product.title;
	(card.querySelector('.card__image') as HTMLImageElement).src = `${CDN_URL}${product.image}`;
	(card.querySelector('.card__price') as HTMLElement).textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

	card.addEventListener('click', () => {
		this.events.emit(AppEvent.PRODUCT_PREVIEW_OPEN, product.id);
	});

	return card;
}

  
}
