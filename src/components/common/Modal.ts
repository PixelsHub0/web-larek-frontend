import { Component } from '../base/Component';

export class Modal extends Component {
	constructor(el: HTMLElement) {
		super(el);
	}

	public setContent(content: HTMLElement): void {}
	public open(): void {}
	public close(): void {}
}
