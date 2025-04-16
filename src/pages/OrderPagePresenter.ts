import { AppState } from "../components/AppState";
import { EventEmitter } from "../components/base/events";

export class OrderPagePresenter {
	constructor(
		private state: AppState,
		private events: EventEmitter
	) {
		this.events.on('order:submit', this.handleSubmit.bind(this));
	}

	private handleSubmit(data: Record<string, unknown>): void {
	}
}
