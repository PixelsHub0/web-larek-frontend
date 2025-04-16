import { Component } from '../base/Component';

export class OrderFormView extends Component<Record<string, unknown>> {
	constructor(el: HTMLElement) {
		super(el);
	}

	// структура, без реализации
	public reset(): void {}
}

