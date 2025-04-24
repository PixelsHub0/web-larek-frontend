// src/components/base/LarekAPI.ts
import { Api } from './api';
import { ApiListResponse } from './api';
import { IApiProductResponse, IApiOrderResponse } from '../../types/api/responses';
import { ICreateOrderRequest } from '../../types/api/requests';

export class LarekAPI extends Api {
  constructor(baseUrl: string) {
    super(baseUrl); // Инициализация базового URL
  }

  // Получение списка продуктов
  public getProducts(): Promise<IApiProductResponse[]> {
    return this.get<ApiListResponse<IApiProductResponse>>('/product')  // Указываем, что возвращаемый объект - ApiListResponse с IApiProductResponse
      .then((data) => data.items); // Извлекаем массив продуктов из поля `items`
  }

  // Получение конкретного продукта по ID
  public getProduct(id: string): Promise<IApiProductResponse> {
    return this.get(`/product/${id}`); // Возвращаем подробную информацию о продукте по ID
  }

  // Создание заказа
  public createOrder(order: ICreateOrderRequest): Promise<IApiOrderResponse> {
    return this.post('/order', order);  // Отправляем заказ на сервер
  }
}
