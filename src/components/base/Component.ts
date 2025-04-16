// src/components/base/Component.ts

export abstract class Component<T = object> {
	protected constructor(protected element: HTMLElement) {}

	public render(data?: T): void {
		if (data) this.setProps(data);
	}

	public setProps(data: Partial<T>) {
		Object.assign(this, data);
	}

	public getElement(): HTMLElement {
		return this.element;
	}

	public destroy(): void {
		this.element.remove();
	}
}
