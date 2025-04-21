import { Component } from '../base/Component';

/**
 * PageView — основной контейнер приложения. 
 * Управляет тем, какие компоненты рендерятся на странице.
 */
export class PageView extends Component {
	constructor(el: HTMLElement) {
		super(el);
	}

	/**
	 * Добавляет каталог в DOM
	 */
	public setCatalog(catalogEl: HTMLElement): void {
		const catalogContainer = this.getElement().querySelector('.catalog');
		catalogContainer?.replaceWith(catalogEl);
	}

	/**
	 * Добавляет форму заказа
	 */
	public setForm(formEl: HTMLElement): void {
		const formContainer = this.getElement().querySelector('.order');
		formContainer?.replaceWith(formEl);
	}

	/**
	 * Добавляет модальное окно (внутрь body или wrapper)
	 */
	public setModal(modalEl: HTMLElement): void {
		document.body.appendChild(modalEl);
	}
}
