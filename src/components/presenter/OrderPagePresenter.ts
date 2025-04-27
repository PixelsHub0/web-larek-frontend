// src/pages/OrderPagePresenter.ts

import { AppState } from '../AppState';
import { EventEmitter } from '../base/EventEmitter';
import { AppEvent } from '../../types';
import { LarekAPI } from '../services/LarekAPI';
import { Modal } from '../common/Modal';
import { Success } from '../common/Success';
import { ICreateOrderRequest } from '../../types';
import { IApiOrderResponse } from '../../types';

/**
 * OrderPagePresenter
 * Отвечает за отправку заказа, отображение окна успешной оплаты
 * и очистку состояния после оформления заказа.
 */
export class OrderPagePresenter {
  private continueButton: HTMLButtonElement | null = null;

  constructor(
    private state: AppState,
    private events: EventEmitter,
    private api: LarekAPI,
    private modal: Modal,
    private success: Success
  ) {
    this.subscribe();
  }

  /**
   * Подписка на событие отправки заказа
   */
  private subscribe(): void {
    this.events.on(AppEvent.ORDER_SUBMIT, this.handleSubmit.bind(this));
  }

  /**
   * Обработчик отправки заказа
   */
  private handleSubmit(): void {
    const order = this.state.getState().order as ICreateOrderRequest;
    
    this.api
      .createOrder(order)
      .then((response: IApiOrderResponse) => {
        this.state.clearBasket();
        this.state.resetOrder();

        this.success.setMessage(`Списано ${response.total} синапсов`);
        this.modal.setContent(this.success.getElement());
        this.modal.open();

        // Кэшируем кнопку только один раз
        if (!this.continueButton) {
          this.continueButton = this.success.getElement().querySelector('.order-success__close') as HTMLButtonElement;
          if (this.continueButton) {
            this.continueButton.addEventListener('click', () => {
              this.modal.close();
            });
          }
        }

        this.events.emit(AppEvent.ORDER_SUCCESS, response);
      })
      .catch(() => {
        alert('Произошла ошибка при оформлении заказа. Попробуйте ещё раз.');
      });
  }
}
