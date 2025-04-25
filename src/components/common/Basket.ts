// src/components/common/Basket.ts
import { Component } from '../base/Component';

/**
 * Компонент Basket отображает список товаров в корзине и общую стоимость.
 */
export class Basket extends Component {
	private list: HTMLElement;
	private totalElement: HTMLElement;

	constructor(el: HTMLElement) {
		super(el);

		// Найдём элементы списка и итоговой цены
		this.list = this.element.querySelector('.basket__list') as HTMLElement;
		this.totalElement = this.element.querySelector('.basket__price') as HTMLElement;
	}

	/**
	 * Устанавливает элементы товаров в корзину
	 * @param items массив DOM-элементов <li>
	 */
	public setItems(items: HTMLElement[]): void {
		this.list.innerHTML = ''; // очищаем список перед новой отрисовкой
		items.forEach(item => this.list.append(item));
	}

	/**
	 * Устанавливает итоговую сумму заказа
	 * @param total сумма в ₽
	 */
	public setTotal(total: number): void {
		this.totalElement.textContent = `${total} синапсов`;
	}
}
