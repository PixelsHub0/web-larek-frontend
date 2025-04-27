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
 * Сообщения об ошибках валидации форм.
 */
export const FORM_ERRORS = {
  addressRequired: 'Введите адрес доставки',
  emailRequired: 'Введите email',
  phoneRequired: 'Введите номер телефона',
  paymentRequired: 'Выберите способ оплаты.'
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
