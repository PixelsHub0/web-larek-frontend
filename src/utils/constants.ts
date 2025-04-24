export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;;
export const CDN_URL = 'https://larek-api.nomoreparties.co/content/weblarek';

export const CATEGORY_LABELS: Record<string, string> = {
  software: 'Софт',
  hardware: 'Хард',
  other: 'Другое',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  ONLINE: 'online',
} as const;

export const FORM_ERRORS = {
  addressRequired: 'Введите адрес доставки',
  emailRequired: 'Введите email',
  phoneRequired: 'Введите номер телефона',
};

export const MESSAGES = {
  orderSuccess: 'Спасибо за заказ! Мы уже начали его собирать 😊',
  orderError: 'Что-то пошло не так. Попробуйте ещё раз.',
};

export enum CheckoutStep {
  DELIVERY = 'delivery',
  CONTACTS = 'contacts',
}

export const categoryMapping: Record<string, string> = {
  другое: 'card__category_other',
  'софт-скил': 'card__category_soft',
  дополнительное: 'card__category_additional',
  кнопка: 'card__category_button',
  'хард-скил': 'card__category_hard',
};

