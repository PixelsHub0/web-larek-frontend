import { Component } from '../base/Component';

export class PageView extends Component {
	constructor(el: HTMLElement) {
		super(el);
	}

	public setCatalog(catalogEl: HTMLElement): void {}
	public setForm(formEl: HTMLElement): void {}
	public setModal(modalEl: HTMLElement): void {}
}
