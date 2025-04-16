import { Component } from '../base/Component';

export class Form extends Component {
	constructor(el: HTMLElement) {
		super(el);
	}

	public disable(): void {}
	public enable(): void {}
	public reset(): void {}
}
