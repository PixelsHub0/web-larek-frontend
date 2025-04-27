// src/components/common/Success.ts

import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';  // ← добавили

/**
 * Компонент Success отображает сообщение об успешной операции:
 * заказ оформлен, форма отправлена и т.п.
 */
export class Success extends Component {
  protected textElement: HTMLElement;

  constructor(el: HTMLElement) {
    super(el);
    // Кэшируем элемент через ensureElement
    this.textElement = ensureElement<HTMLElement>('.order-success__description', this.element);
  }

  /**
   * Устанавливает текстовое сообщение об успехе.
   * @param message текст, который нужно показать
   */
  public setMessage(message: string): void {
    this.setText(this.textElement, message);
  }
}
