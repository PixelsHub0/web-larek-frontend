// src/components/pages/CatalogPresenter.ts

import { AppState } from "../components/AppState";
import { EventEmitter } from "../components/base/events";

export class CatalogPresenter {
	constructor(
		private events: EventEmitter,
		private state: AppState
	) {
		this.subscribe();
	}

	private subscribe(): void {
		this.events.on('catalog:changed', () => {
			// Здесь в будущем будет логика обновления вьюшек
		});
	}
}
