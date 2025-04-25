import { Component } from '../base/Component';

/**
 * Modal — универсальное модальное окно.
 * Позволяет:
 * - отобразить любой HTML внутри себя
 * - управлять открытием и закрытием
 */
export class Modal extends Component {
	protected content: HTMLElement;
	protected closeButton: HTMLElement;

	constructor(el: HTMLElement) {
		super(el);
		this.content = el.querySelector('.modal__content') as HTMLElement;
		this.closeButton = el.querySelector('.modal__close') as HTMLElement;
		this.closeButton.addEventListener('click', () => this.close());
		this.element.addEventListener('click', (e: MouseEvent) => {
			if (e.target === this.element) {
				this.close();
			}
		});
	}

	/**
	 * Устанавливает содержимое модального окна.
	 * @param content DOM-элемент для отображения внутри модалки
	 */
	public setContent(content: HTMLElement): void {
		this.content.innerHTML = '';
		this.content.append(content);
	}

	/**
	 * Открывает модальное окно.
	 */
	public open(): void {
		this.element.classList.add('modal_active');
	}

	/**
	 * Закрывает модальное окно.
	 */
	public close(): void {
		this.element.classList.remove('modal_active');
		document.body.style.overflow = '';
	}
}
