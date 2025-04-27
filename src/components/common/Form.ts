// src/components/common/Form.ts

import { Component } from '../base/Component';
import { ensureAllElements } from '../../utils/utils';  // ← добавили

/**
 * Form — универсальный компонент для работы с HTML-формами.
 * Управляет:
 * - активацией/деактивацией полей
 * - сбросом формы
 */
export class Form extends Component {
  private elements: (HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement | HTMLSelectElement)[];

  constructor(el: HTMLElement) {
    super(el);

    // Сохраняем найденные элементы формы в поле класса один раз
    this.elements = ensureAllElements<
      HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement | HTMLSelectElement
    >('input, select, textarea, button', this.element);
  }

  /**
   * Делает все поля и кнопки формы неактивными.
   */
  public disable(): void {
    this.elements.forEach(el => {
      this.setDisabled(el, true);
    });
  }

  /**
   * Делает все поля и кнопки формы активными.
   */
  public enable(): void {
    this.elements.forEach(el => {
      this.setDisabled(el, false);
    });
  }

  /**
   * Сбрасывает все поля формы до значений по умолчанию.
   */
  public reset(): void {
    (this.element as HTMLFormElement).reset();
  }
}
