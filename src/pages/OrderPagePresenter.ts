// src/pages/OrderPagePresenter.ts

import { AppState } from '../components/AppState';
import { EventEmitter } from '../components/base/EventEmitter';
import { AppEvent } from '../types';
import { LarekAPI } from '../components/base/LarekAPI';
import { Modal } from '../components/common/Modal';
import { Success } from '../components/common/Success';
import { ICreateOrderRequest } from '../types';
import { IApiOrderResponse } from '../types';

export class OrderPagePresenter {
  constructor(
    private state: AppState,
    private events: EventEmitter,
    private api: LarekAPI,
    private modal: Modal,
    private success: Success
  ) {
    this.subscribe();
  }

  private subscribe(): void {
    // Восстанавливаем прямую подписку на ORDER_SUBMIT
    this.events.on(AppEvent.ORDER_SUBMIT, this.handleSubmit.bind(this));
  }
	
	private handleSubmit(): void {
  const order = this.state.getState().order as ICreateOrderRequest;

  console.log('📦 Финальные данные перед отправкой:', JSON.stringify(order, null, 2));

  this.api
    .createOrder(order)
    .then((response: IApiOrderResponse) => {
      this.state.clearBasket();
      this.state.resetOrder();

      this.success.setMessage(`Списано ${response.total} синапсов`);
      this.modal.setContent(this.success.getElement());
      this.modal.open();

      // 👉 Добавляем обработчик кнопки "За новыми покупками!"
      const continueBtn = this.success.getElement().querySelector('.order-success__close') as HTMLButtonElement;
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          this.modal.close();
        });
      }

      this.events.emit(AppEvent.ORDER_SUCCESS, response);
    })
    .catch(error => {
      console.error('🚨 Ошибка при оформлении заказа:', error);
      alert('Произошла ошибка при оформлении заказа. Попробуйте ещё раз.');
    });
}

}
