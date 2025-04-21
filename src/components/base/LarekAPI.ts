// src/components/base/LarekAPI.ts

import { Api } from './api';
import { IApiProductResponse, IApiOrderResponse } from '../../types/api/responses';
import { ICreateOrderRequest } from '../../types/api/requests';
import { API_URL } from '../../utils/constants';

/**
 * IApiClient описывает контракт API-клиента.
 * Это позволяет использовать подстановку и мок-версии API.
 */
export interface IApiClient {
	getProducts(): Promise<IApiProductResponse[]>;
	createOrder(order: ICreateOrderRequest): Promise<IApiOrderResponse>;
	getProduct(id: string): Promise<IApiProductResponse>;
}

/**
 * Класс LarekAPI реализует интерфейс IApiClient и наследует базовый класс Api.
 * Позволяет взаимодействовать с сервером: получить товары и создать заказ.
 */
export class LarekAPI extends Api implements IApiClient {
	constructor(baseUrl: string) {
		super(baseUrl); // Теперь URL задаётся извне (например, из .env)
	}

	public getProducts(): Promise<IApiProductResponse[]> {
	return this.get('/product')
		.then((data: { items: IApiProductResponse[] }) => data.items);
}


	public getProduct(id: string): Promise<IApiProductResponse> {
		return this.get(`/product/${id}`) as Promise<IApiProductResponse>;
	}

	public createOrder(order: ICreateOrderRequest): Promise<IApiOrderResponse> {
		return this.post('/order', order) as Promise<IApiOrderResponse>;
	}
}
