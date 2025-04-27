// src/components/views/ContactFormView.ts

import { Component } from '../base/Component';
import { EventEmitter } from '../base/EventEmitter';
import { AppEvent } from '../../types';
import { FORM_ERRORS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';  // ← добавили импорт

/**
 * Класс ContactFormView отвечает за управление формой ввода контактных данных пользователя:
 * email и телефона.
 */
export class ContactFormView extends Component {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLElement;

  /**
   * @param element HTML-форма ввода контактов
   * @param events  EventEmitter для связи с остальными частями приложения
   */
  constructor(protected element: HTMLFormElement, protected events: EventEmitter) {
    super(element);

    // Получаем все необходимые элементы формы через ensureElement
    this.emailInput    = ensureElement<HTMLInputElement>('input[name="email"]', this.element);
    this.phoneInput    = ensureElement<HTMLInputElement>('input[name="phone"]', this.element);
    this.submitButton  = ensureElement<HTMLButtonElement>('button[type="submit"]', this.element);
    this.errorContainer= ensureElement<HTMLElement>('.form__errors', this.element);

    // Устанавливаем обработчики событий
    this.configure();
  }

  /**
   * Настройка обработчиков событий для формы:
   * — проверка валидности при вводе данных
   * — отправка формы
   */
  private configure(): void {
    this.emailInput.addEventListener('input', () => this.validate());
    this.phoneInput.addEventListener('input', () => this.validate());

    this.element.addEventListener('submit', e => {
      e.preventDefault();
      if (!this.validate()) return;

      this.events.emit(AppEvent.ORDER_UPDATED, {
        email: this.emailInput.value,
        phone: this.phoneInput.value,
      });
      this.events.emit(AppEvent.ORDER_SUBMIT);
    });
  }

  /**
   * Валидация полей формы контактов:
   * — проверяет наличие email и телефона
   * @returns boolean — валидна ли форма
   */
  private validate(): boolean {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();
    let isValid = true;

    if (!email) {
      this.showError(FORM_ERRORS.emailRequired);
      isValid = false;
    } else if (!phone) {
      this.showError(FORM_ERRORS.phoneRequired);
      isValid = false;
    } else {
      this.clearError();
    }

    this.setDisabled(this.submitButton, !isValid);
    return isValid;
  }

  /**
   * Сброс полей формы и очистка ошибок.
   */
  public reset(): void {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.setDisabled(this.submitButton, true);
    this.clearError();
  }

  /**
   * Отображение сообщения об ошибке.
   * @param message Текст ошибки
   */
  private showError(message: string): void {
    this.setText(this.errorContainer, message);
  }

  /**
   * Очистка текста ошибок.
   */
  private clearError(): void {
    this.setText(this.errorContainer, '');
  }
}
