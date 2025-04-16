import { Component } from '../base/Component';

export class ProductCardView extends Component<Record<string, unknown>> {
	constructor(el: HTMLElement) {
		super(el);
	}

	public toggleSelected(selected: boolean): void {}
}
