// src/components/base/LarekAPI.ts

import { Api } from './api';
import { ApiListResponse } from './api';
import { IApiProductResponse, IApiOrderResponse } from '../../types/api/responses';
import { ICreateOrderRequest } from '../../types/api/requests';

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
    super(baseUrl); // Инициализация базового URL через базовый класс
  }

  /**
   * Получение списка всех доступных продуктов с сервера.
   * @returns Промис, который резолвится в массив объектов товаров
   */
  public getProducts(): Promise<IApiProductResponse[]> {
    return this.get<ApiListResponse<IApiProductResponse>>('/product')  // Выполняем GET-запрос по эндпоинту /product
      .then((data) => data.items); // Извлекаем массив товаров из ответа сервера
  }

  /**
   * Получение информации о конкретном продукте по его идентификатору.
   * @param id Идентификатор продукта
   * @returns Промис, который резолвится в объект товара
   */
  public getProduct(id: string): Promise<IApiProductResponse> {
    return this.get(`/product/${id}`); // Выполняем GET-запрос для получения данных о продукте
  }

  /**
   * Отправка данных заказа на сервер для оформления покупки.
   * @param order Объект заказа с данными пользователя и списком товаров
   * @returns Промис, который резолвится в ответ сервера о созданном заказе
   */
  public createOrder(order: ICreateOrderRequest): Promise<IApiOrderResponse> {
    return this.post('/order', order);  // Выполняем POST-запрос на эндпоинт /order с данными заказа
  }
}
