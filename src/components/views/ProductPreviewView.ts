// src/components/views/ProductPreviewView.ts

import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { CDN_URL } from '../../utils/constants';
import { AppEvent } from '../../types';
import { EventEmitter } from '../base/EventEmitter';
import { categoryMapping } from '../../utils/constants';

export class ProductPreviewView extends Component {
  protected template: HTMLTemplateElement;

  constructor(template: HTMLTemplateElement, private events: EventEmitter) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);
    this.template = template;
  }

  public render(product: IApiProductResponse): HTMLElement {
    const preview = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const img = preview.querySelector('.card__image') as HTMLImageElement;
    const title = preview.querySelector('.card__title') as HTMLElement;
    const description = preview.querySelector('.card__text') as HTMLElement;
    const price = preview.querySelector('.card__price') as HTMLElement;
    const category = preview.querySelector('.card__category') as HTMLElement;
    const buyButton = preview.querySelector('.card__button') as HTMLButtonElement;

    img.src = CDN_URL + product.image;
    img.alt = product.title;
    title.textContent = product.title;
    description.textContent = product.description;
      price.textContent = `${product.price ?? 'Бесценно'} синапсов`;
      category.textContent = product.category;
    category.className = `card__category ${categoryMapping[product.category] ?? ''}`;


    if (product.price === null) {
      // Заблокировать кнопку, если товар без цены
      buyButton.disabled = true;
      buyButton.textContent = 'Нет в наличии';
    } else {
      buyButton.textContent = 'В корзину';
      buyButton.addEventListener('click', (e) => {
        e.stopPropagation(); // чтобы не сработал клик по карточке
        console.log('🛒 Клик по кнопке "в корзину" из модального окна:', product.id);
        this.events.emit(AppEvent.ORDER_ADD_PRODUCT, product.id);
      });
    }

    return preview;
  }
}
