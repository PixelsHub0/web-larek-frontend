// src/components/views/ProductPreviewView.ts

import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { CDN_URL, categoryMapping } from '../../utils/constants';
import { AppEvent } from '../../types';
import { EventEmitter } from '../base/EventEmitter';
import { AppState } from '../AppState'; // ← Добавили импорт AppState

export class ProductPreviewView extends Component {
  protected template: HTMLTemplateElement;

  constructor(
    template: HTMLTemplateElement,
    private events: EventEmitter,
    private state: AppState // ← Добавили AppState
  ) {
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

    const updateButton = () => {
      const inCart = this.state.getState().basket.includes(product.id);
      buyButton.textContent = inCart ? 'Удалить из корзины' : 'В корзину';
    };

    // Начальное состояние кнопки
    if (product.price === null) {
      buyButton.disabled = true;
      buyButton.textContent = 'Нет в наличии';
    } else {
      updateButton();
      buyButton.onclick = (e) => {
        e.stopPropagation();
        const inCart = this.state.getState().basket.includes(product.id);

        if (inCart) {
          this.events.emit(AppEvent.ORDER_REMOVE_PRODUCT, product.id);
        } else {
          this.events.emit(AppEvent.ORDER_ADD_PRODUCT, product.id);
        }

        // Мгновенное обновление текста кнопки
        updateButton();
      };
    }

    return preview;
  }
}
