import { EventEmitter } from './EventEmitter';

export abstract class Model<T> {
	protected state: T;

	constructor(protected events: EventEmitter, initialState: T) {
		this.state = initialState;
	}

	public getState(): T {
		return this.state;
	}

	public setState(newState: Partial<T>): void {
		this.state = { ...this.state, ...newState };
		this.emitState();
	}

	protected abstract emitState(): void;
}
