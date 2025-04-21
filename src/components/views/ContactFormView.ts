// src/components/views/ContactFormView.ts

import { Component } from '../base/Component';
import { EventEmitter } from '../base/EventEmitter';
import { AppEvent } from '../../types';
import { FORM_ERRORS } from '../../utils/constants';

export class ContactFormView extends Component {
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;
	private errorContainer: HTMLElement;

	constructor(protected element: HTMLFormElement, protected events: EventEmitter) {
		super(element);

		this.emailInput = this.element.querySelector('input[name="email"]')!;
		this.phoneInput = this.element.querySelector('input[name="phone"]')!;
		this.submitButton = this.element.querySelector('button[type="submit"]')!;
		this.errorContainer = this.element.querySelector('.form__errors')!;

		this.configure();
	}

	private configure(): void {
		this.emailInput.addEventListener('input', () => this.validate());
		this.phoneInput.addEventListener('input', () => this.validate());

		this.element.addEventListener('submit', (e) => {
			e.preventDefault();

			if (this.validate()) {
				console.log('📧 ContactFormView — отправка данных:', {
					email: this.emailInput.value,
					phone: this.phoneInput.value,
				});

				// 🔥 Ждём обновления заказа — потом отправляем
				setTimeout(() => {
					this.events.emit(AppEvent.ORDER_UPDATED, {
						email: this.emailInput.value,
						phone: this.phoneInput.value,
					});

					this.events.emit(AppEvent.ORDER_SUBMIT);
				}, 0);
			}
		});
	}

	private validate(): boolean {
		const email = this.emailInput.value.trim();
		const phone = this.phoneInput.value.trim();
		let isValid = true;

		if (!email) {
			this.showError(FORM_ERRORS.emailRequired);
			isValid = false;
		} else if (!phone) {
			this.showError(FORM_ERRORS.phoneRequired);
			isValid = false;
		} else {
			this.clearError();
		}

		this.submitButton.disabled = !isValid;
		return isValid;
	}

	public reset(): void {
		this.emailInput.value = '';
		this.phoneInput.value = '';
		this.submitButton.disabled = true;
		this.clearError();
	}

	private showError(message: string): void {
		this.errorContainer.textContent = message;
	}

	private clearError(): void {
		this.errorContainer.textContent = '';
	}
}
