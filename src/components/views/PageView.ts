// src/components/views/PageView.ts

import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

/**
 * PageView — основной контейнер приложения. 
 * Управляет тем, какие компоненты рендерятся на странице.
 */
export class PageView extends Component {
  private catalogContainer: HTMLElement;
  private formContainer: HTMLElement;

  constructor(el: HTMLElement) {
    super(el);

    // Кэшируем контейнеры через ensureElement
    this.catalogContainer = ensureElement<HTMLElement>('.catalog', this.element);
    this.formContainer    = ensureElement<HTMLElement>('.order',   this.element);
  }

  /**
   * Добавляет каталог в DOM
   */
  public setCatalog(catalogEl: HTMLElement): void {
    this.catalogContainer.replaceWith(catalogEl);
  }

  /**
   * Добавляет форму заказа
   */
  public setForm(formEl: HTMLElement): void {
    this.formContainer.replaceWith(formEl);
  }

  /**
   * Добавляет модальное окно (внутрь body или wrapper)
   */
  public setModal(modalEl: HTMLElement): void {
    document.body.appendChild(modalEl);
  }
}
