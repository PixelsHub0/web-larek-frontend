// src/components/services/LarekAPI.ts

import { Api, ApiListResponse } from "../base/api";
import { IApiProductResponse, IApiOrderResponse } from '../../types/api/responses';
import { ICreateOrderRequest } from '../../types/api/requests';
import { CDN_URL } from '../../utils/constants';

/**
 * Класс LarekAPI наследуется от базового Api и реализует взаимодействие с сервером
 * для получения списка товаров, информации о товаре и оформления заказа.
 */
export class LarekAPI extends Api {
  /**
   * Конструктор принимает базовый URL для API и передаёт его в базовый класс Api.
   * @param baseUrl Базовый URL для запросов к серверу
   */
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Получение списка всех доступных продуктов с сервера.
   * Здесь же формируем полный URL до изображения.
   * @returns Промис, который резолвится в массив объектов товаров
   */
  public getProducts(): Promise<IApiProductResponse[]> {
    return this.get<ApiListResponse<IApiProductResponse>>('/product')
      .then(data =>
        data.items.map(prod => ({
          ...prod,
          image: `${CDN_URL}${prod.image}`,
        }))
      );
  }

  /**
   * Получение информации о конкретном продукте по его идентификатору.
   * Формируем полный URL до изображения.
   * @param id Идентификатор продукта
   * @returns Промис, который резолвится в объект товара
   */
  public getProduct(id: string): Promise<IApiProductResponse> {
    return this.get<IApiProductResponse>(`/product/${id}`)
      .then(prod => ({
        ...prod,
        image: `${CDN_URL}${prod.image}`,
      }));
  }

  /**
   * Отправка данных заказа на сервер для оформления покупки.
   * @param order Объект заказа с данными пользователя и списком товаров
   * @returns Промис, который резолвится в ответ сервера о созданном заказе
   */
  public createOrder(order: ICreateOrderRequest): Promise<IApiOrderResponse> {
    return this.post('/order', order);
  }
}
