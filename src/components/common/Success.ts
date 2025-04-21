import { Component } from '../base/Component';

/**
 * Компонент Success отображает сообщение об успешной операции:
 * заказ оформлен, форма отправлена и т.п.
 */
export class Success extends Component {
	protected textElement: HTMLElement;

	constructor(el: HTMLElement) {
		super(el);
		// Ищем элемент, внутрь которого будем вставлять сообщение
		this.textElement = el.querySelector('.order-success__description') as HTMLElement;
	}

	/**
	 * Устанавливает текстовое сообщение об успехе.
	 * @param message текст, который нужно показать
	 */
	public setMessage(message: string): void {
		this.setText(this.textElement, message);
	}
}
