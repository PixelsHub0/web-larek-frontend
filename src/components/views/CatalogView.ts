// src/components/views/CatalogView.ts

import { Component } from '../base/Component';
import { IApiProductResponse } from '../../types/api/responses';
import { AppEvent } from '../../types/events/enum';
import { EventEmitter } from '../base/EventEmitter';
import { CDN_URL, categoryMapping } from '../../utils/constants';

/**
 * Класс CatalogView отвечает за отображение списка карточек товаров в каталоге на главной странице.
 */
export class CatalogView extends Component {
  /**
   * @param container Контейнер, в который будут отрисовываться карточки товаров
   * @param events Брокер событий для общения с другими частями приложения
   */
  constructor(
    protected container: HTMLElement,
    protected events: EventEmitter
  ) {
    super(container);
  }

  /**
   * Метод для отрисовки каталога товаров.
   * @param products Массив товаров, полученных с сервера
   */
  public render(products: IApiProductResponse[]): void {
    // Очищаем контейнер перед новой отрисовкой
    this.container.innerHTML = '';

    // Создаём и добавляем карточку для каждого товара
    products.forEach(product => {
      const card = this.createCard(product);
      this.container.append(card);
    });
  }

  /**
   * Метод для создания отдельной карточки товара.
   * @param product Данные одного товара
   * @returns HTML-элемент карточки товара
   */
  protected createCard(product: IApiProductResponse): HTMLElement {
    // Получаем шаблон карточки из HTML
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    // Устанавливаем id товара в dataset карточки
    card.dataset.id = product.id;

    // Заполняем данные карточки: категория, название, изображение и цена
    const categoryElement = card.querySelector('.card__category') as HTMLElement;
    categoryElement.textContent = product.category;
    categoryElement.classList.add(categoryMapping[product.category] || 'card__category_other');

    (card.querySelector('.card__title') as HTMLElement).textContent = product.title;
    (card.querySelector('.card__image') as HTMLImageElement).src = `${CDN_URL}${product.image}`;
    (card.querySelector('.card__price') as HTMLElement).textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

    // При клике на карточку — открыть модальное окно с подробным описанием товара
    card.addEventListener('click', () => {
      this.events.emit(AppEvent.PRODUCT_PREVIEW_OPEN, product.id);
    });

    return card;
  }
}
