import { Component } from '../base/Component';

/**
 * Form — универсальный компонент для работы с HTML-формами.
 * Управляет:
 * - активацией/деактивацией полей
 * - сбросом формы
 */
export class Form extends Component {
	constructor(el: HTMLElement) {
		super(el);
	}

	/**
	 * Делает все поля и кнопки формы неактивными.
	 */
	public disable(): void {
		const elements = this.element.querySelectorAll('input, select, textarea, button');
		elements.forEach((el) => {
			(el as HTMLInputElement | HTMLButtonElement).disabled = true;
		});
	}

	/**
	 * Делает все поля и кнопки формы активными.
	 */
	public enable(): void {
		const elements = this.element.querySelectorAll('input, select, textarea, button');
		elements.forEach((el) => {
			(el as HTMLInputElement | HTMLButtonElement).disabled = false;
		});
	}

	/**
	 * Сбрасывает все поля формы до значений по умолчанию.
	 */
	public reset(): void {
		(this.element as HTMLFormElement).reset();
	}
}
