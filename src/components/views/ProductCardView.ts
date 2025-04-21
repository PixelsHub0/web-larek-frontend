import { Component } from '../base/Component';

/**
 * ProductCardView — компонент одной карточки товара.
 * Управляет её визуальным состоянием (например, добавлена в корзину или нет).
 */
export class ProductCardView extends Component<Record<string, unknown>> {
	constructor(el: HTMLElement) {
		super(el);
	}

	/**
	 * Включает/выключает класс .card_selected
	 * чтобы подсветить выбор карточки
	 */
	public toggleSelected(selected: boolean): void {
		this.getElement().classList.toggle('card_selected', selected);
	}
}
