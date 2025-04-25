// src/components/views/OrderFormView.ts

import { Component } from '../base/Component';
import { AppEvent } from '../../types';
import { EventEmitter } from '../base/EventEmitter';
import { FORM_ERRORS } from '../../utils/constants';

/**
 * Класс OrderFormView отвечает за управление формой доставки заказа.
 */
export class OrderFormView extends Component {
  private addressInput: HTMLInputElement;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLElement;

  private payment: string | null = null;

  /**
   * @param element HTML-форма оформления заказа
   * @param events EventEmitter для связи с остальными частями приложения
   */
  constructor(protected element: HTMLFormElement, protected events: EventEmitter) {
    super(element);

    // Находим все необходимые элементы внутри формы
    this.addressInput = this.element.querySelector('input[name="address"]')!;
    this.paymentButtons = this.element.querySelectorAll('button[name]');
    this.submitButton = this.element.querySelector('.order__button')!;
    this.errorContainer = this.element.querySelector('.form__errors')!;

    // Конфигурируем обработчики событий
    this.configure();
  }

  /**
   * Настройка обработчиков событий формы:
   * — выбор способа оплаты
   * — ввод адреса
   * — отправка формы
   */
  private configure(): void {
    // Обработчик выбора способа оплаты
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Снимаем выделение со всех кнопок и выделяем выбранную
        this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        this.payment = button.name;
        this.validate();
      });
    });

    // Обработчик ввода адреса
    this.addressInput.addEventListener('input', () => {
      this.validate();
    });

    // Обработчик отправки формы
    this.element.addEventListener('submit', e => {
      e.preventDefault(); // Предотвращаем перезагрузку страницы
      if (!this.validate()) return;

      // Обновляем данные заказа в AppState
      this.events.emit(AppEvent.ORDER_UPDATED, {
        address: this.addressInput.value,
        payment: this.payment,
      });

      // Переходим ко второму шагу — заполнение контактов
      this.events.emit(AppEvent.ORDER_CONTACTS_REQUIRED);
    });
  }

  /**
   * Валидация полей формы доставки:
   * — Проверяет заполненность адреса и выбор способа оплаты
   * @returns boolean — валидна ли форма
   */
  private validate(): boolean {
    const address = this.addressInput.value.trim();
    const isValid = address.length > 0 && !!this.payment;

    // Активируем или деактивируем кнопку отправки
    this.submitButton.disabled = !isValid;

    if (!address) {
      // Показываем ошибку если адрес не введён
      this.showError(FORM_ERRORS.addressRequired);
    } else {
      this.clearError();
    }

    return isValid;
  }

  /**
   * Сброс формы к начальному состоянию.
   */
  public reset(): void {
    this.addressInput.value = '';
    this.payment = null;
    this.submitButton.disabled = true;
    this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
    this.clearError();
  }

  /**
   * Вывод сообщения об ошибке в форму.
   * @param message Текст ошибки
   */
  private showError(message: string): void {
    this.errorContainer.textContent = message;
  }

  /**
   * Очистка текста ошибок в форме.
   */
  private clearError(): void {
    this.errorContainer.textContent = '';
  }
}
