import { AppState } from '../AppState';
import { EventEmitter } from '../base/EventEmitter';
import { CatalogView } from '../views/CatalogView';
import { AppEvent } from '../../types';
import { IApiProductResponse } from '../../types';

/**
 * CatalogPresenter — презентер каталога товаров.
 * Реагирует на события, получает данные из AppState и обновляет CatalogView.
 */
export class CatalogPresenter {
	constructor(
		private events: EventEmitter,
		private state: AppState,
		private catalogView: CatalogView
	) {
		this.subscribe();
	}

	/**
	 * Подписка на события приложения.
	 */
	private subscribe(): void {
		this.events.on(AppEvent.CATALOG_CHANGED, () => {
			const catalog: IApiProductResponse[] = this.state.getState().catalog;
			this.catalogView.render(catalog);
		});
		this.events.on(AppEvent.ORDER_ADD_PRODUCT, (id: string) => {
			this.state.addToBasket(id);
		});
	}
}
