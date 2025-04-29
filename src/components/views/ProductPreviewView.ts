// src/components/views/ProductPreviewView.ts

import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { CDN_URL, categoryMapping } from '../../utils/constants';
import { AppEvent } from '../../types';
import { EventEmitter } from '../base/EventEmitter';
import { AppState } from '../AppState';
import { ensureElement } from '../../utils/utils';

/**
 * Компонент предпросмотра товара в модальном окне.
 */
export class ProductPreviewView extends Component {
  private templateElement: HTMLTemplateElement;

  constructor(
    templateElement: HTMLTemplateElement,
    private events: EventEmitter,
    private state: AppState
  ) {
    // Передаём в базовый Component один клон шаблона
    super(templateElement.content.firstElementChild!.cloneNode(true) as HTMLElement);
    this.templateElement = templateElement;
  }

  /**
   * Рендерит карточку товара в модальном окне.
   * @param product Данные товара
   * @returns HTMLElement — готовый элемент для вставки в Modal
   */
  public render(product: IApiProductResponse): HTMLElement {
    // Клонируем свежий экземпляр шаблона
    const preview = this.templateElement.content
      .firstElementChild!
      .cloneNode(true) as HTMLElement;

    // Кэшируем нужные элементы из клона
    const imageEl    = ensureElement<HTMLImageElement>('.card__image',    preview);
    const titleEl    = ensureElement<HTMLElement>     ('.card__title',    preview);
    const descEl     = ensureElement<HTMLElement>     ('.card__text',     preview);
    const priceEl    = ensureElement<HTMLElement>     ('.card__price',    preview);
    const categoryEl = ensureElement<HTMLElement>     ('.card__category', preview);
    const buttonEl   = ensureElement<HTMLButtonElement>('.card__button',  preview);

    // 1) Очищаем все возможные цветовые классы
    Object.values(categoryMapping).forEach(cls => {
      categoryEl.classList.remove(cls);
    });

    // 2) Устанавливаем текст и нужный CSS-класс для категории
    this.setText(categoryEl, product.category);
    const mapClass = categoryMapping[product.category] ?? 'card__category_other';
    this.toggleClass(categoryEl, mapClass, true);

    // 3) Корректно склеиваем URL изображения
    const imageUrl = product.image.startsWith('http')
      ? product.image
      : `${CDN_URL.replace(/\/+$/, '')}/${product.image.replace(/^\/+/, '')}`;
    this.setImage(imageEl, imageUrl, product.title);

    // 4) Заполняем остальные поля
    this.setText(titleEl, product.title);
    this.setText(descEl, product.description);
    this.setText(
      priceEl,
      product.price !== null ? `${product.price} синапсов` : 'Бесценно'
    );

    // 5) Настраиваем кнопку:
    if (product.price === null) {
      // Нет в наличии
      this.setDisabled(buttonEl, true);
      this.setText(buttonEl, 'Нет в наличии');
      buttonEl.onclick = null;
    } else {
      // Определяем, в корзине ли товар сейчас
      const inCart = this.state.getState().basket.includes(product.id);
      this.setDisabled(buttonEl, false);
      this.setText(buttonEl, inCart ? 'Удалить из корзины' : 'В корзину');

      // Один обработчик через onclick — не дублируем события
      buttonEl.onclick = e => {
        e.stopPropagation();
        const wasInCart = this.state.getState().basket.includes(product.id);
        this.events.emit(
          wasInCart ? AppEvent.ORDER_REMOVE_PRODUCT : AppEvent.ORDER_ADD_PRODUCT,
          product.id
        );
        // Обновляем текст сразу после клика
        const nowInCart = this.state.getState().basket.includes(product.id);
        this.setText(buttonEl, nowInCart ? 'Удалить из корзины' : 'В корзину');
      };
    }

    return preview;
  }
}
