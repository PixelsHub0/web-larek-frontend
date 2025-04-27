// src/components/base/api.ts

export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/**
 * Базовый HTTP-клиент для взаимодействия с сервером.
 */
export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers ?? {})
            }
        };
    }

    /**
     * Обработка ответа сервера.
     */
    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) {
            return response.json() as Promise<T>;
        } else {
            return response.json()
                .then(data => Promise.reject(data.error ?? response.statusText));
        }
    }

    /**
     * Выполнение GET-запроса.
     */
    public get<T>(uri: string): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    /**
     * Выполнение POST-, PUT- или DELETE-запроса.
     */
    public post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }
}
