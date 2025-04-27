// src/components/common/Modal.ts

import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

/**
 * Modal — универсальное модальное окно.
 * Позволяет:
 * - отобразить любой HTML внутри себя
 * - управлять открытием и закрытию
 */
export class Modal extends Component {
  protected content: HTMLElement;
  protected closeButton: HTMLElement;

  constructor(el: HTMLElement) {
    super(el);

    // Кэшируем элементы через ensureElement
    this.content     = ensureElement<HTMLElement>('.modal__content', this.element);
    this.closeButton = ensureElement<HTMLElement>('.modal__close',   this.element);

    this.closeButton.addEventListener('click', () => this.close());
    this.element.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.element) {
        this.close();
      }
    });
  }

  /**
   * Устанавливает содержимое модального окна.
   * @param content DOM-элемент для отображения внутри модалки
   */
  public setContent(content: HTMLElement): void {
    this.content.innerHTML = '';
    this.content.append(content);
  }

  /**
   * Открывает модальное окно.
   */
  public open(): void {
    this.toggleClass(this.element, 'modal_active', true);
  }

  /**
   * Закрывает модальное окно.
   */
  public close(): void {
    this.toggleClass(this.element, 'modal_active', false);
    document.body.style.overflow = '';
  }
}
