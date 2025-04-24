// src/components/base/api.ts
import { IApiProductResponse } from "../../types";

export type ApiListResponse<Type> = {
    total: number, // Общее количество элементов на сервере
    items: Type[] // Массив элементов определённого типа (generic)
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Класс Api — базовый HTTP-клиент
export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    // Общая обработка ответа
    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) {
            return response.json() as Promise<T>;
        } else {
            return response.json()
                .then(data => Promise.reject(data.error ?? response.statusText));
        }
    }

    // GET запрос
    get<T>(uri: string): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    // POST запрос
    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }

    // Метод для получения продукта по ID
    getProductById(id: string): Promise<IApiProductResponse> {
        return this.get(`/product/${id}`);  // Убедитесь, что API возвращает именно IApiProductResponse
    }
}
