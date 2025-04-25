// src/components/views/ContactFormView.ts

import { Component } from '../base/Component';
import { EventEmitter } from '../base/EventEmitter';
import { AppEvent } from '../../types';
import { FORM_ERRORS } from '../../utils/constants';

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
   * @param events EventEmitter для связи с остальными частями приложения
   */
  constructor(protected element: HTMLFormElement, protected events: EventEmitter) {
    super(element);

    // Получаем все необходимые элементы формы
    this.emailInput = this.element.querySelector('input[name="email"]')!;
    this.phoneInput = this.element.querySelector('input[name="phone"]')!;
    this.submitButton = this.element.querySelector('button[type="submit"]')!;
    this.errorContainer = this.element.querySelector('.form__errors')!;

    // Устанавливаем обработчики событий
    this.configure();
  }

  /**
   * Настройка обработчиков событий для формы:
   * — проверка валидности при вводе данных
   * — отправка формы
   */
  private configure(): void {
    // При изменении ввода email или телефона запускаем валидацию
    this.emailInput.addEventListener('input', () => this.validate());
    this.phoneInput.addEventListener('input', () => this.validate());

    // Обработка отправки формы
    this.element.addEventListener('submit', e => {
      e.preventDefault(); // Предотвращаем перезагрузку страницы
      if (!this.validate()) return;

      // Обновляем данные заказа в AppState
      this.events.emit(AppEvent.ORDER_UPDATED, {
        email: this.emailInput.value,
        phone: this.phoneInput.value,
      });

      // Подаём сигнал о завершении оформления заказа
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

    // Делаем кнопку активной только при успешной валидации
    this.submitButton.disabled = !isValid;
    return isValid;
  }

  /**
   * Сброс полей формы и очистка ошибок.
   */
  public reset(): void {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.submitButton.disabled = true;
    this.clearError();
  }

  /**
   * Отображение сообщения об ошибке.
   * @param message Текст ошибки
   */
  private showError(message: string): void {
    this.errorContainer.textContent = message;
  }

  /**
   * Очистка текста ошибок.
   */
  private clearError(): void {
    this.errorContainer.textContent = '';
  }
}
