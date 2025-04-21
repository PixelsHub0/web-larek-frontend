export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

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
