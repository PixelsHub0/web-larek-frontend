// src/components/views/OrderFormView.ts

import { Component } from '../base/Component';
import { AppEvent } from '../../types';
import { EventEmitter } from '../base/EventEmitter';
import { FORM_ERRORS } from '../../utils/constants';

export class OrderFormView extends Component {
  private addressInput: HTMLInputElement;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLElement;

  private payment: string | null = null;

  constructor(protected element: HTMLFormElement, protected events: EventEmitter) {
    super(element);

    this.addressInput = this.element.querySelector('input[name="address"]')!;
    this.paymentButtons = this.element.querySelectorAll('button[name]');
    this.submitButton = this.element.querySelector('.order__button')!;
    this.errorContainer = this.element.querySelector('.form__errors')!;

    this.configure();
  }

  private configure(): void {
    // Выбор способа оплаты
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        this.payment = button.name;
        this.validate();
      });
    });

    // Ввод адреса
    this.addressInput.addEventListener('input', () => {
      this.validate();
    });

    // Сабмит формы
    this.element.addEventListener('submit', e => {
      e.preventDefault();
      if (!this.validate()) return;

      // Сначала обновляем заказ в AppState
      this.events.emit(AppEvent.ORDER_UPDATED, {
        address: this.addressInput.value,
        payment: this.payment,
      });
      console.log('📦 OrderFormView — отправка:', {
        address: this.addressInput.value,
        payment: this.payment,
      });

      // переходим ко второму шагу — контакты
	this.events.emit(AppEvent.ORDER_CONTACTS_REQUIRED);

    });
  }

  /**
   * Проверка валидности полей формы.
   */
  private validate(): boolean {
    const address = this.addressInput.value.trim();
    const isValid = address.length > 0 && !!this.payment;

    this.submitButton.disabled = !isValid;

    if (!address) {
      this.showError(FORM_ERRORS.addressRequired);
    } else {
      this.clearError();
    }

    return isValid;
  }

  /**
   * Сбрасывает поля и ошибки формы.
   */
  public reset(): void {
    this.addressInput.value = '';
    this.payment = null;
    this.submitButton.disabled = true;
    this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
    this.clearError();
  }

  private showError(message: string): void {
    this.errorContainer.textContent = message;
  }

  private clearError(): void {
    this.errorContainer.textContent = '';
  }
}
