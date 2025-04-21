//Тип ApiListResponse<Type> — универсальный ответ с массивом объектов и полем total, который описывет ответ от API при получении списка сущностей.
export type ApiListResponse<Type> = {
    total: number, //	Общее количество элементов на сервере
    items: Type[] //Массив элементов определённого типа (generic)
};

//Тип ApiPostMethods — ограничивает методами POST, PUT, DELETE
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

//Класс Api — базовый HTTP-клиент, на основе которого можно строить конкретные API
/*
Он инкапсулирует:

отправку GET, POST, PUT, DELETE запросов

установку заголовков

обработку ошибок и успешных ответов


*/
export class Api {
    readonly baseUrl: string; //Базовый URL, к которому добавляется путь.
    protected options: RequestInit; //Хранит конфигурацию для fetch: заголовки, токен и т.д.
/*
конструктор:
 - Сохраняет baseUrl.

 - Устанавливает заголовок Content-Type: application/json по умолчанию.

 - Если передан options.headers, объединяет их с дефолтными.
*/
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }
/*
handleResponse :
- Проверяет, успешен ли ответ (response.ok)

- Если да — возвращает распарсенный JSON

 - Если нет — выбрасывает ошибку (Promise.reject)
 */
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }
/*
get: 
 - Выполняет GET-запрос на baseUrl + uri
 - Возвращает Promise, результат обрабатывается через handleResponse
*/
    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }
/*
post:
 - Выполняет POST, PUT или DELETE-запрос

 - Сериализует data в JSON (JSON.stringify)

 - Метод по умолчанию — POST

 - Обрабатывает ответ через handleResponse
*/
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
}
/*
✅ Вывод по api.ts

Элемент	Назначение
Api	Базовый HTTP-клиент: отправляет запросы и обрабатывает ответы
get()	Обертка для GET-запроса
post()	Обертка для POST, PUT, DELETE
handleResponse()	Обрабатывает ответ и выбрасывает ошибку, если нужно
ApiListResponse	Универсальный тип ответа от сервера с total и items
ApiPostMethods	Разрешённые методы HTTP для post()
 */