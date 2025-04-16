// src/components/base/LarekAPI.ts

import { Api } from './api';
import { IApiClient } from '../../types/api/client';
import { IApiProductResponse, IApiOrderResponse } from '../../types/api/responses';
import { ICreateOrderRequest } from '../../types/api/requests';

export class LarekAPI extends Api implements IApiClient {
	constructor() {
		super('https://larek-api.nomoreparties.co');
	}

	public getProducts(): Promise<IApiProductResponse[]> {
		return this.get('/product') as Promise<IApiProductResponse[]>;
	}

	public getProduct(id: string): Promise<IApiProductResponse> {
		return this.get(`/product/${id}`) as Promise<IApiProductResponse>;
	}

	public createOrder(order: ICreateOrderRequest): Promise<IApiOrderResponse> {
		return this.post('/order', order) as Promise<IApiOrderResponse>;
	}
}
