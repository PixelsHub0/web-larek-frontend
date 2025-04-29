// src/components/views/ProductPreviewView.ts

import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { CDN_URL, categoryMapping } from '../../utils/constants';
import { AppEvent } from '../../types';
import { EventEmitter } from '../base/EventEmitter';
import { AppState } from '../AppState';
import { ensureElement } from '../../utils/utils';

/**
 * Компонент для отображения модального окна с подробной информацией о товаре.
 */
export class ProductPreviewView extends Component {
  private templateElement: HTMLTemplateElement;

  constructor(
    templateElement: HTMLTemplateElement,
    private events: EventEmitter,
    private state: AppState
  ) {
    super(templateElement.content.firstElementChild!.cloneNode(true) as HTMLElement);
    this.templateElement = templateElement;
  }

  /**
   * Рендерит карточку товара в модальном окне.
   * @param product Объект товара для отображения
   * @returns HTMLElement — готовый элемент карточки
   */
  public render(product: IApiProductResponse): HTMLElement {
    // Клонируем шаблон
    const previewElement =
      this.templateElement.content.firstElementChild!
        .cloneNode(true) as HTMLElement;

    // Кэшируем все нужные подэлементы
    const imageElement       = ensureElement<HTMLImageElement>('.card__image',    previewElement);
    const titleElement       = ensureElement<HTMLElement>     ('.card__title',    previewElement);
    const descriptionElement = ensureElement<HTMLElement>     ('.card__text',     previewElement);
    const priceElement       = ensureElement<HTMLElement>     ('.card__price',    previewElement);
    const categoryElement    = ensureElement<HTMLElement>     ('.card__category', previewElement);
    const buttonElement      = ensureElement<HTMLButtonElement>('.card__button',   previewElement);

    // Корректное склеивание URL изображения
    const imageUrl = product.image.startsWith('http')
      ? product.image
      : `${CDN_URL.replace(/\/+$/, '')}/${product.image.replace(/^\/+/, '')}`;
    this.setImage(imageElement, imageUrl, product.title);

    // Заполняем текстовые поля
    this.setText(titleElement, product.title);
    this.setText(descriptionElement, product.description);
    this.setText(
      priceElement,
      product.price !== null
        ? `${product.price} синапсов`
        : 'Бесценно'
    );

    // Устанавливаем категорию и цветовой класс
    this.setText(categoryElement, product.category);
    this.toggleClass(
      categoryElement,
      categoryMapping[product.category] ?? 'card__category_other',
      true
    );

    // Функция для обновления текста кнопки
    const updateButtonText = (): void => {
      const inCart = this.state.getState().basket.includes(product.id);
      this.setText(buttonElement, inCart ? 'Удалить из корзины' : 'В корзину');
    };

    if (product.price === null) {
      // Если товара нет в наличии
      this.setDisabled(buttonElement, true);
      this.setText(buttonElement, 'Нет в наличии');
    } else {
      updateButtonText();
      buttonElement.addEventListener('click', event => {
        event.stopPropagation();
        const inCart = this.state.getState().basket.includes(product.id);
        this.events.emit(
          inCart
            ? AppEvent.ORDER_REMOVE_PRODUCT
            : AppEvent.ORDER_ADD_PRODUCT,
          product.id
        );
        updateButtonText();
      });
    }

    return previewElement;
  }
}
