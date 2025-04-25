// src/components/views/ProductPreviewView.ts

import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { CDN_URL, categoryMapping } from '../../utils/constants';
import { AppEvent } from '../../types';
import { EventEmitter } from '../base/EventEmitter';
import { AppState } from '../AppState'; // Импорт состояния приложения

/**
 * Компонент для отображения модального окна с подробной информацией о товаре.
 */
export class ProductPreviewView extends Component {
  protected template: HTMLTemplateElement;

  constructor(
    template: HTMLTemplateElement,      // HTML-шаблон карточки
    private events: EventEmitter,        // Экземпляр EventEmitter для обработки событий
    private state: AppState              // Экземпляр состояния приложения
  ) {
    // Создаём элемент на основе шаблона
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);
    this.template = template;
  }

  /**
   * Рендерит карточку товара в модальном окне.
   * @param product Объект товара для отображения
   * @returns HTMLElement — готовый элемент карточки для вставки в DOM
   */
  public render(product: IApiProductResponse): HTMLElement {
    const preview = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    // Находим необходимые элементы внутри карточки
    const img = preview.querySelector('.card__image') as HTMLImageElement;
    const title = preview.querySelector('.card__title') as HTMLElement;
    const description = preview.querySelector('.card__text') as HTMLElement;
    const price = preview.querySelector('.card__price') as HTMLElement;
    const category = preview.querySelector('.card__category') as HTMLElement;
    const buyButton = preview.querySelector('.card__button') as HTMLButtonElement;

    // Устанавливаем значения полей карточки
    img.src = CDN_URL + product.image;
    img.alt = product.title;
    title.textContent = product.title;
    description.textContent = product.description;
    price.textContent = `${product.price ?? 'Бесценно'} синапсов`;
    category.textContent = product.category;
    category.className = `card__category ${categoryMapping[product.category] ?? ''}`;

    /**
     * Обновляет текст кнопки в зависимости от состояния товара в корзине.
     */
    const updateButton = () => {
      const inCart = this.state.getState().basket.includes(product.id);
      buyButton.textContent = inCart ? 'Удалить из корзины' : 'В корзину';
    };

    // Устанавливаем начальное состояние кнопки
    if (product.price === null) {
      // Если товара нет в наличии, блокируем кнопку
      buyButton.disabled = true;
      buyButton.textContent = 'Нет в наличии';
    } else {
      updateButton();

      // Добавляем обработчик клика по кнопке "Купить / Удалить из корзины"
      buyButton.onclick = (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события клика

        const inCart = this.state.getState().basket.includes(product.id);

        if (inCart) {
          // Если товар уже в корзине — удаляем
          this.events.emit(AppEvent.ORDER_REMOVE_PRODUCT, product.id);
        } else {
          // Иначе — добавляем
          this.events.emit(AppEvent.ORDER_ADD_PRODUCT, product.id);
        }

        // Мгновенно обновляем текст кнопки
        updateButton();
      };
    }

    return preview;
  }
}
