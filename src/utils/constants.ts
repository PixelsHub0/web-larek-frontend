/**
 * URL базового API сервера.
 * Используется для отправки и получения данных с сервера.
 */
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;

/**
 * Базовый URL для загрузки изображений товаров.
 */
export const CDN_URL = 'https://larek-api.nomoreparties.co/content/weblarek';

/**
 * Словарь для отображения человекочитаемых названий категорий товаров.
 */
export const CATEGORY_LABELS: Record<string, string> = {
  software: 'Софт',
  hardware: 'Хард',
  other: 'Другое',
};

/**
 * Доступные способы оплаты.
 */
export const PAYMENT_METHODS = {
  CASH: 'cash',    // Оплата при получении
  ONLINE: 'online', // Онлайн-оплата
} as const;

/**
 * Сообщения об ошибках валидации форм.
 */
export const FORM_ERRORS = {
  addressRequired: 'Введите адрес доставки',
  emailRequired: 'Введите email',
  phoneRequired: 'Введите номер телефона',
};

/**
 * Сообщения для пользователя по итогам оформления заказа.
 */
export const MESSAGES = {
  orderSuccess: 'Спасибо за заказ! Мы уже начали его собирать 😊',
  orderError: 'Что-то пошло не так. Попробуйте ещё раз.',
};

/**
 * Этапы оформления заказа.
 */
export enum CheckoutStep {
  DELIVERY = 'delivery', // Выбор способа доставки
  CONTACTS = 'contacts', // Ввод контактной информации
}

/**
 * Маппинг названий категорий товаров на соответствующие CSS-классы оформления.
 */
export const categoryMapping: Record<string, string> = {
  другое: 'card__category_other',
  'софт-скил': 'card__category_soft',
  дополнительное: 'card__category_additional',
  кнопка: 'card__category_button',
  'хард-скил': 'card__category_hard',
};
