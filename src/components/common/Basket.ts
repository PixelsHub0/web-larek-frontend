import { Component } from '../base/Component';

export class Basket extends Component {
	constructor(el: HTMLElement) {
		super(el);
	}

	public setItems(items: HTMLElement[]): void {}
	public setTotal(total: number): void {}
}
