// src/components/views/ProductPreviewView.ts

import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { CDN_URL, categoryMapping } from '../../utils/constants';
import { AppEvent } from '../../types';
import { EventEmitter } from '../base/EventEmitter';
import { AppState } from '../AppState';
import { ensureElement } from '../../utils/utils';  // ← добавили

/**
 * Компонент для отображения модального окна с подробной информацией о товаре.
 */
export class ProductPreviewView extends Component {
  private template: HTMLTemplateElement;

  constructor(
    template: HTMLTemplateElement,
    private events: EventEmitter,
    private state: AppState
  ) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);
    this.template = template;
  }

  /**
   * Рендерит карточку товара в модальном окне.
   * @param product Объект товара для отображения
   * @returns HTMLElement — готовый элемент карточки
   */
  public render(product: IApiProductResponse): HTMLElement {
    // Клонируем шаблон
    const preview = this.template.content.firstElementChild!
      .cloneNode(true) as HTMLElement;

    // Кэшируем элементы через ensureElement
    const imgEl       = ensureElement<HTMLImageElement>('.card__image',    preview);
    const titleEl     = ensureElement<HTMLElement>     ('.card__title',    preview);
    const descEl      = ensureElement<HTMLElement>     ('.card__text',     preview);
    const priceEl     = ensureElement<HTMLElement>     ('.card__price',    preview);
    const categoryEl  = ensureElement<HTMLElement>     ('.card__category', preview);
    const buyButton   = ensureElement<HTMLButtonElement>('.card__button',   preview);

    // Устанавливаем картинку и alt
    this.setImage(imgEl, `${CDN_URL}${product.image}`, product.title);

    // Заполняем текстовые поля
    this.setText(titleEl, product.title);
    this.setText(descEl, product.description);
    this.setText(
      priceEl,
      product.price !== null
        ? `${product.price} синапсов`
        : 'Бесценно'
    );
    this.setText(categoryEl, product.category);

    // Ставим CSS-класс категории
    this.toggleClass(
      categoryEl,
      categoryMapping[product.category] ?? '',
      true
    );

    // Функция обновления текста кнопки
    const updateButton = () => {
      const inCart = this.state.getState().basket.includes(product.id);
      this.setText(
        buyButton,
        inCart ? 'Удалить из корзины' : 'В корзину'
      );
    };

    if (product.price === null) {
      this.setDisabled(buyButton, true);
      this.setText(buyButton, 'Нет в наличии');
    } else {
      updateButton();
      buyButton.addEventListener('click', e => {
        e.stopPropagation();
        const inCart = this.state.getState().basket.includes(product.id);
        this.events.emit(
          inCart
            ? AppEvent.ORDER_REMOVE_PRODUCT
            : AppEvent.ORDER_ADD_PRODUCT,
          product.id
        );
        updateButton();
      });
    }

    return preview;
  }
}
