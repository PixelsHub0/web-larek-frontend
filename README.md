# **Веб-приложение "Ларёк" - Документация архитектуры**
## **Технологический стек**
```Язык: TypeScript

Архитектура: MVP (Model-View-Presenter)

Брокер событий: EventEmitter

HTTP-клиент: Fetch API

Сборка: Webpack
```
## **Инструкция по запуску**

```bash
# 1. Установите зависимости
npm install
```

```
# 2. Запустите приложение
npm run start
```
## **Архитектура**
![UML Диаграмма проекта](src/images/8%20проктная%20работа%20Readme.png)
## **Структура проекта**
```
src/
├── core/                  # Базовые абстрактные классы
│   ├── EventEmitter.ts    # Реализация IEventEmitter
│   ├── BaseModel.ts       # Абстрактный BaseModel<T>
│   ├── BaseView.ts        # Абстрактный BaseView
│   └── BasePresenter.ts   # Абстрактный BasePresenter
│
├── types/                 # Все типы и интерфейсы
│   ├── api/               # Типы для работы с API
│   │   ├── client.ts      # IApiClient
│   │   ├── requests.ts    # ICreateOrderRequest
│   │   └── responses.ts   # IApiProductResponse, IApiOrderResponse
│   │
│   ├── app/               # Типы приложения
│   │   ├── product.ts     # IProduct
│   │   ├── cart.ts        # ICartItem
│   │   ├── order.ts       # IOrderForm, IOrder
│   │   └── state.ts       # IAppState
│   │
│   └── events/            # Система событий
│       ├── enum.ts        # AppEvents
│       └── types.ts       # IEventMap, IEventEmitter
│
├── models/                # Конкретные реализации моделей
│   ├── AppModel.ts        # Реализация модели приложения
│   └── CartModel.ts       # Реализация модели корзины
│
├── presenters/            # Презентеры
│   ├── AppPresenter.ts
│   └── CartPresenter.ts
│
├── views/                 # Представления
│   ├── AppView.ts
│   ├── CartView.ts
│   └── ProductView.ts
│
├── services/              # Сервисы
│   └── ApiClient.ts       # Реализация IApiClient
│
├── app.ts                 # Инициализация приложения
└── index.ts               # Точка входа
```

**Проект реализован по паттерну MVP (Model-View-Presenter) с использованием системы событий для взаимодействия между компонентами.**

### 1. Core компоненты

#### EventEmitter
**Назначение**: Базовый класс для реализации системы событий. Позволяет компонентам подписываться на события (`on`), отписываться (`off`) и генерировать события (`emit`).

**Ключевые методы**:
- `on(event, callback)` - подписка на событие
- `off(event, callback)` - отписка от события
- `emit(event, ...args)` - генерация события

#### BaseModel
**Назначение**: Абстрактный базовый класс для всех моделей. Хранит состояние приложения и уведомляет подписчиков об изменениях через EventEmitter.

**Ключевые методы**:
- `getState()` - возвращает текущее состояние
- `updateState(newState)` - обновляет часть состояния

#### BaseView
**Назначение**: Абстрактный базовый класс для всех представлений. Отвечает за отображение данных и обработку пользовательских действий.

**Ключевые методы**:
- `render(data)` - отрисовывает представление с переданными данными
- `bindEvents()` - настраивает обработчики событий (вызывается внутри render)

#### BasePresenter
**Назначение**: Абстрактный базовый класс для всех презентеров. Координирует взаимодействие между Model и View.

**Ключевые методы**:
- `initialize()` - инициализирует компонент (загрузка данных, начальная настройка)

### 2. Data компоненты

#### Интерфейсы данных

**IApiClient**:
```typescript
interface IApiClient {
  getProducts(): Promise<IApiProductResponse[]>;
  createOrder(order: ICreateOrderRequest): Promise<IApiOrderResponse>;
  getProduct(id: string): Promise<IApiProductResponse>;
}
```
## **Основные модели данных:**

- **IProduct - описание товара (id, название, цена, изображение и т.д.)**

- **ICartItem - товар в корзине (продукт + количество)**

- **IOrder - информация о заказе (платеж, контакты, адрес, товары)**

- **IAppState - глобальное состояние приложения (товары, корзина, текущий заказ)**

### **3. Система событий**
**Определены в AppEvents:**

**PRODUCTS_LOADED** - товары загружены

**CART_UPDATED** - корзина обновлена

**ORDER_CREATED** - заказ создан

**ERROR_OCCURRED** - произошла ошибка

### **Взаимодействие компонентов**
#### **Загрузка продуктов:**

- **Presenter вызывает метод API через Model**

- **Model получает данные и генерирует PRODUCTS_LOADED**

- **Presenter обновляет View новыми данными**

### **Работа с корзиной:**

- **Пользовательские действия в View генерируют события**

- **Presenter обновляет Model (корзину)**

- **Model генерирует CART_UPDATED**

- **Presenter обновляет View с новым состоянием корзины**

### **Создание заказа:**

- **View собирает данные формы**

- **Presenter валидирует и передает в Model**

- **Model отправляет заказ на сервер и генерирует ORDER_CREATED**

- **Presenter обновляет View (подтверждение заказа)**
## **Типы данных**
#### **Основные интерфейсы данных:**
```
interface IProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
}

interface ICartItem {
  product: IProduct;
  quantity: number;
}

interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  items: ICartItem[];
  total: number;
}

interface IAppState {
  products: IProduct[];
  cart: ICartItem[];
  currentOrder?: IOrder;
}
```
