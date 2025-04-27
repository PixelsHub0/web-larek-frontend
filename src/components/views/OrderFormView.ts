// src/components/views/OrderFormView.ts

import { Component } from '../base/Component';
import { EventEmitter } from '../base/EventEmitter';
import { AppEvent } from '../../types';
import { ensureElement, ensureAllElements } from '../../utils/utils'; 

/**
 * Класс OrderFormView отвечает за управление формой доставки заказа:
 * отправляет изменения полей в AppState и рендерит результат валидации.
 */
export class OrderFormView extends Component {
  private addressInput: HTMLInputElement;
  private paymentButtons: HTMLButtonElement[];
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLElement;

  constructor(protected element: HTMLFormElement, protected events: EventEmitter) {
    super(element);

    // Кэшируем все нужные элементы формы через ensure*
    this.paymentButtons = ensureAllElements<HTMLButtonElement>('button[name]', this.element);
    this.addressInput   = ensureElement<HTMLInputElement>('input[name="address"]', this.element);
    this.submitButton   = ensureElement<HTMLButtonElement>('.order__button', this.element);
    this.errorContainer = ensureElement<HTMLElement>('.form__errors', this.element);

    this.configure();

    // Подписка на результат валидации из AppState
    this.events.on(AppEvent.ORDER_FORM_VALIDITY_CHANGED, ({ isValid, errors }) => {
      this.setDisabled(this.submitButton, !isValid);

      if (errors.address) {
        this.showError(errors.address);
      } else if (errors.payment) {
        this.showError(errors.payment);
      } else {
        this.clearError();
      }
    });
  }

  /**
   * Навешивает слушатели:
   * — выбор способа оплаты,
   * — ввод адреса,
   * — отправка формы.
   */
  private configure(): void {
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        // обновляем UI кнопок
        this.paymentButtons.forEach(b => this.toggleClass(b, 'button_alt-active', false));
        this.toggleClass(button, 'button_alt-active', true);

        // отправляем новое значение payment в модель
        this.events.emit(AppEvent.ORDER_UPDATED, { payment: button.name });
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit(AppEvent.ORDER_UPDATED, { address: this.addressInput.value });
    });

    this.element.addEventListener('submit', e => {
      e.preventDefault();
      this.events.emit(AppEvent.ORDER_CONTACTS_REQUIRED);
    });
  }

  /** Сброс формы к первоначальному состоянию. */
  public reset(): void {
    this.addressInput.value = '';
    this.paymentButtons.forEach(btn => this.toggleClass(btn, 'button_alt-active', false));
    this.setDisabled(this.submitButton, true);
    this.clearError();
  }

  /** Показывает текст ошибки */
  private showError(message: string): void {
    this.setText(this.errorContainer, message);
  }

  /** Очищает текст ошибки */
  private clearError(): void {
    this.setText(this.errorContainer, '');
  }
}
